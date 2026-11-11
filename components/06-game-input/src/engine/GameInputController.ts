import { Disposable, Vector2D } from '../../../../core/shared-types/src/index.js';
import {
  InputControllerConfig,
  InputGestureEvent,
  InputGestureType,
  InputListener,
  RawPointerEvent,
} from '../types/index.js';

interface ActivePointer {
  start: RawPointerEvent;
  current: RawPointerEvent;
  longPressTimer?: any;
  hasTriggeredLongPress: boolean;
}

export class GameInputController implements Disposable {
  private readonly config: Required<InputControllerConfig>;
  private readonly activePointers = new Map<number, ActivePointer>();
  private readonly listeners = new Set<InputListener>();
  private readonly actionListeners = new Map<string, Set<(event: InputGestureEvent) => void>>();
  private _isDisposed = false;

  constructor(config: InputControllerConfig = {}) {
    this.config = {
      swipeThresholdPx: config.swipeThresholdPx ?? 40,
      longPressThresholdMs: config.longPressThresholdMs ?? 500,
      actionMap: config.actionMap ?? {
        tap: 'ACTION_PRIMARY',
        press: 'ACTION_PRESS',
        release: 'ACTION_RELEASE',
        drag: 'ACTION_DRAG',
        swipe_up: 'JUMP',
        swipe_down: 'SLIDE',
        swipe_left: 'MOVE_LEFT',
        swipe_right: 'MOVE_RIGHT',
        long_press: 'ACTION_LONG_PRESS',
      },
    };
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public onPointerDown(id: number, pos: Vector2D, time = Date.now()): void {
    if (this._isDisposed) return;

    const raw: RawPointerEvent = { id, position: { ...pos }, timestamp: time };
    const pointer: ActivePointer = {
      start: raw,
      current: raw,
      hasTriggeredLongPress: false,
    };

    // Schedule long-press
    pointer.longPressTimer = setTimeout(() => {
      if (!this._isDisposed && this.activePointers.has(id)) {
        pointer.hasTriggeredLongPress = true;
        this.emitGesture('long_press', pointer);
      }
    }, this.config.longPressThresholdMs);

    this.activePointers.set(id, pointer);
    this.emitGesture('press', pointer);
  }

  public onPointerMove(id: number, pos: Vector2D, time = Date.now()): void {
    if (this._isDisposed) return;
    const pointer = this.activePointers.get(id);
    if (!pointer) return;

    pointer.current = { id, position: { ...pos }, timestamp: time };

    const dx = pointer.current.position.x - pointer.start.position.x;
    const dy = pointer.current.position.y - pointer.start.position.y;
    const distSq = dx * dx + dy * dy;

    if (distSq > 100 && pointer.longPressTimer) {
      clearTimeout(pointer.longPressTimer);
      pointer.longPressTimer = undefined;
    }

    this.emitGesture('drag', pointer);
  }

  public onPointerUp(id: number, pos: Vector2D, time = Date.now()): void {
    if (this._isDisposed) return;
    const pointer = this.activePointers.get(id);
    if (!pointer) return;

    pointer.current = { id, position: { ...pos }, timestamp: time };
    if (pointer.longPressTimer) {
      clearTimeout(pointer.longPressTimer);
    }

    const dx = pointer.current.position.x - pointer.start.position.x;
    const dy = pointer.current.position.y - pointer.start.position.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (pointer.hasTriggeredLongPress) {
      this.emitGesture('release', pointer);
      this.activePointers.delete(id);
      return;
    }

    if (absDx >= this.config.swipeThresholdPx || absDy >= this.config.swipeThresholdPx) {
      if (absDx > absDy) {
        this.emitGesture(dx > 0 ? 'swipe_right' : 'swipe_left', pointer);
      } else {
        this.emitGesture(dy > 0 ? 'swipe_down' : 'swipe_up', pointer);
      }
    } else {
      this.emitGesture('tap', pointer);
    }

    this.emitGesture('release', pointer);
    this.activePointers.delete(id);
  }

  public onGesture(listener: InputListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public onAction(action: string, handler: (event: InputGestureEvent) => void): () => void {
    if (!this.actionListeners.has(action)) {
      this.actionListeners.set(action, new Set());
    }
    this.actionListeners.get(action)!.add(handler);
    return () => this.actionListeners.get(action)?.delete(handler);
  }

  public setActionMap(map: Record<InputGestureType, string>): void {
    this.config.actionMap = { ...map };
  }

  public dispose(): void {
    this._isDisposed = true;
    for (const pointer of this.activePointers.values()) {
      if (pointer.longPressTimer) clearTimeout(pointer.longPressTimer);
    }
    this.activePointers.clear();
    this.listeners.clear();
    this.actionListeners.clear();
  }

  private emitGesture(type: InputGestureType, pointer: ActivePointer): void {
    const start = pointer.start.position;
    const current = pointer.current.position;
    const delta: Vector2D = {
      x: current.x - start.x,
      y: current.y - start.y,
    };
    const durationMs = Math.max(1, pointer.current.timestamp - pointer.start.timestamp);
    const mappedAction = this.config.actionMap[type];

    const event: InputGestureEvent = {
      type,
      startPosition: start,
      currentPosition: current,
      delta,
      durationMs,
      velocity: {
        x: (delta.x / durationMs) * 1000,
        y: (delta.y / durationMs) * 1000,
      },
      mappedAction,
    };

    for (const listener of this.listeners) {
      listener(event);
    }

    if (mappedAction && this.actionListeners.has(mappedAction)) {
      for (const handler of this.actionListeners.get(mappedAction)!) {
        handler(event);
      }
    }
  }
}

