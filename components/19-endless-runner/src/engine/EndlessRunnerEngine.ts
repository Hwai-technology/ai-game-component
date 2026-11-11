import { Disposable } from '../../../../core/shared-types/src/index.js';
import { EndlessRunnerConfig, EndlessRunnerState, RunnerAction, RunnerLane } from '../types/index.js';

export class EndlessRunnerEngine implements Disposable {
  private lane: RunnerLane = 1; // Start in center
  private isJumping = false;
  private isSliding = false;
  private jumpTimer = 0;
  private slideTimer = 0;
  private distance = 0;
  private currentSpeed: number;
  private readonly maxSpeed: number;
  private readonly acceleration: number;
  private isGameOver = false;
  private _isDisposed = false;

  constructor(config: EndlessRunnerConfig = {}) {
    this.currentSpeed = config.initialSpeed ?? 200;
    this.maxSpeed = config.maxSpeed ?? 800;
    this.acceleration = config.acceleration ?? 5;
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getState(): EndlessRunnerState {
    return {
      lane: this.lane,
      isJumping: this.isJumping,
      isSliding: this.isSliding,
      distance: Math.floor(this.distance),
      currentSpeed: this.currentSpeed,
      isGameOver: this.isGameOver,
    };
  }

  public performAction(action: RunnerAction): void {
    if (this._isDisposed || this.isGameOver) return;

    switch (action) {
      case 'lane_left':
        if (this.lane > 0) this.lane = (this.lane - 1) as RunnerLane;
        break;
      case 'lane_right':
        if (this.lane < 2) this.lane = (this.lane + 1) as RunnerLane;
        break;
      case 'jump':
        if (!this.isJumping) {
          this.isJumping = true;
          this.isSliding = false;
          this.jumpTimer = 0.6; // 600ms jump window
        }
        break;
      case 'slide':
        if (!this.isSliding) {
          this.isSliding = true;
          this.isJumping = false;
          this.slideTimer = 0.6; // 600ms slide window
        }
        break;
    }
  }

  public step(deltaSeconds: number): void {
    if (this._isDisposed || this.isGameOver) return;

    // Advance distance and speed
    this.distance += this.currentSpeed * deltaSeconds;
    this.currentSpeed = Math.min(this.maxSpeed, this.currentSpeed + this.acceleration * deltaSeconds);

    // Update jump duration
    if (this.isJumping) {
      this.jumpTimer -= deltaSeconds;
      if (this.jumpTimer <= 0) {
        this.isJumping = false;
        this.jumpTimer = 0;
      }
    }

    // Update slide duration
    if (this.isSliding) {
      this.slideTimer -= deltaSeconds;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
        this.slideTimer = 0;
      }
    }
  }

  public triggerCrash(): void {
    this.isGameOver = true;
  }

  public reset(): void {
    this.lane = 1;
    this.isJumping = false;
    this.isSliding = false;
    this.distance = 0;
    this.currentSpeed = 200;
    this.isGameOver = false;
  }

  public dispose(): void {
    this._isDisposed = true;
  }
}

