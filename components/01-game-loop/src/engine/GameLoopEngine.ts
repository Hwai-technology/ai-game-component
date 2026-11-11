import { Disposable } from '../../../../core/shared-types/src/index.js';
import {
  GameLoopConfig,
  GameLoopRenderCallback,
  GameLoopState,
  GameLoopTickPayload,
  GameLoopUpdateCallback,
} from '../types/index.js';

export class GameLoopEngine implements Disposable {
  private readonly config: Required<GameLoopConfig>;
  private readonly updateListeners = new Set<GameLoopUpdateCallback>();
  private readonly renderListeners = new Set<GameLoopRenderCallback>();

  private isRunning = false;
  private isPaused = false;
  private _isDisposed = false;

  private frameId: number | null = null;
  private lastTime = 0;
  private accumulator = 0;
  private totalTime = 0;
  private frameCount = 0;
  private currentFps = 0;
  private fpsTimer = 0;
  private fpsFrames = 0;

  constructor(config: GameLoopConfig = {}) {
    this.config = {
      fps: config.fps ?? 60,
      fixedTimestep: config.fixedTimestep ?? true,
      maxDeltaTime: config.maxDeltaTime ?? 0.1,
      autoStart: config.autoStart ?? false,
    };

    if (this.config.autoStart) {
      this.start();
    }
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public onUpdate(callback: GameLoopUpdateCallback): () => void {
    this.updateListeners.add(callback);
    return () => this.updateListeners.delete(callback);
  }

  public onRender(callback: GameLoopRenderCallback): () => void {
    this.renderListeners.add(callback);
    return () => this.renderListeners.delete(callback);
  }

  public start(): void {
    if (this._isDisposed || this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = this.getCurrentTime();
    this.accumulator = 0;
    this.scheduleFrame();
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    if (this._isDisposed) return;
    this.isPaused = false;
    if (this.isRunning) {
      this.lastTime = this.getCurrentTime();
      this.accumulator = 0;
      this.scheduleFrame();
    }
  }

  public stop(): void {
    this.isRunning = false;
    this.isPaused = false;
    this.cancelScheduledFrame();
  }

  public reset(): void {
    this.stop();
    this.totalTime = 0;
    this.frameCount = 0;
    this.accumulator = 0;
    this.currentFps = this.config.fps;
  }

  /**
   * Manual deterministic tick step, ideal for headless unit tests and fixed simulations.
   */
  public step(deltaSeconds: number): void {
    if (this._isDisposed || this.isPaused) return;

    const clampedDelta = Math.min(Math.max(deltaSeconds, 0), this.config.maxDeltaTime);
    const fixedStep = 1 / this.config.fps;

    if (this.config.fixedTimestep) {
      this.accumulator += clampedDelta;
      while (this.accumulator >= fixedStep) {
        this.tickUpdate(fixedStep);
        this.accumulator -= fixedStep;
      }
      const interpolation = this.accumulator / fixedStep;
      this.tickRender(interpolation);
    } else {
      this.tickUpdate(clampedDelta);
      this.tickRender(1);
    }
  }

  public getState(): GameLoopState {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      frameCount: this.frameCount,
      totalTime: this.totalTime,
      fps: this.currentFps,
    };
  }

  public dispose(): void {
    this._isDisposed = true;
    this.stop();
    this.updateListeners.clear();
    this.renderListeners.clear();
  }

  private getCurrentTime(): number {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
  }

  private scheduleFrame(): void {
    if (!this.isRunning || this.isPaused || this._isDisposed) return;

    const g = globalThis as unknown as {
      requestAnimationFrame?: (cb: (time: number) => void) => number;
    };

    if (typeof g.requestAnimationFrame === 'function') {
      this.frameId = g.requestAnimationFrame(this.handleRafTick);
    } else {
      const stepMs = Math.floor(1000 / this.config.fps);
      this.frameId = setTimeout(this.handleRafTick, stepMs) as unknown as number;
    }
  }

  private cancelScheduledFrame(): void {
    if (this.frameId !== null) {
      const g = globalThis as unknown as {
        cancelAnimationFrame?: (id: number) => void;
      };

      if (typeof g.cancelAnimationFrame === 'function') {
        g.cancelAnimationFrame(this.frameId);
      } else {
        clearTimeout(this.frameId);
      }
      this.frameId = null;
    }
  }

  private handleRafTick = (): void => {
    if (!this.isRunning || this.isPaused || this._isDisposed) return;

    const now = this.getCurrentTime();
    const rawDelta = (now - this.lastTime) / 1000;
    this.lastTime = now;

    // Track FPS
    this.fpsFrames++;
    this.fpsTimer += rawDelta;
    if (this.fpsTimer >= 1.0) {
      this.currentFps = Math.round(this.fpsFrames / this.fpsTimer);
      this.fpsFrames = 0;
      this.fpsTimer = 0;
    }

    this.step(rawDelta);
    this.scheduleFrame();
  };

  private tickUpdate(delta: number): void {
    this.frameCount++;
    this.totalTime += delta;

    const payload: GameLoopTickPayload = {
      deltaTime: delta,
      totalTime: this.totalTime,
      currentFps: this.currentFps || this.config.fps,
      frameCount: this.frameCount,
    };

    for (const listener of this.updateListeners) {
      listener(payload);
    }
  }

  private tickRender(interpolation: number): void {
    for (const listener of this.renderListeners) {
      listener(interpolation);
    }
  }
}
