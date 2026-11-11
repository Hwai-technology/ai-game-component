import { Vector2D } from '../../../../core/shared-types/src/index.js';

export type InputGestureType =
  | 'tap'
  | 'press'
  | 'release'
  | 'drag'
  | 'swipe_up'
  | 'swipe_down'
  | 'swipe_left'
  | 'swipe_right'
  | 'long_press';

export interface RawPointerEvent {
  id: number;
  position: Vector2D;
  timestamp: number;
}

export interface InputGestureEvent {
  type: InputGestureType;
  startPosition: Vector2D;
  currentPosition: Vector2D;
  delta: Vector2D;
  velocity?: Vector2D;
  durationMs: number;
  mappedAction?: string;
}

export interface InputControllerConfig {
  swipeThresholdPx?: number;
  longPressThresholdMs?: number;
  actionMap?: Record<InputGestureType, string>;
}

export type InputListener = (event: InputGestureEvent) => void;

