import { Disposable, Vector2D } from '../../../../core/shared-types/src/index.js';
import { CharacterMovementState, FacingDirection, MovementConfig } from '../types/index.js';

export class CharacterMovementController implements Disposable {
  private position: Vector2D = { x: 0, y: 0 };
  private velocity: Vector2D = { x: 0, y: 0 };
  private facing: FacingDirection = 'down';

  private readonly maxSpeed: number;
  private readonly acceleration: number;
  private readonly deceleration: number;
  private _isDisposed = false;

  constructor(config: MovementConfig = {}, initialPos: Vector2D = { x: 0, y: 0 }) {
    this.maxSpeed = config.maxSpeed ?? 200;
    this.acceleration = config.acceleration ?? 800;
    this.deceleration = config.deceleration ?? 1000;
    this.position = { ...initialPos };
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public setPosition(pos: Vector2D): void {
    this.position = { ...pos };
  }

  public step(deltaSeconds: number, inputVector: Vector2D): void {
    if (this._isDisposed || deltaSeconds <= 0) return;

    // 1. Normalize input vector if magnitude > 1
    const lenSq = inputVector.x * inputVector.x + inputVector.y * inputVector.y;
    let normX = inputVector.x;
    let normY = inputVector.y;

    if (lenSq > 1) {
      const len = Math.sqrt(lenSq);
      normX /= len;
      normY /= len;
    }

    const hasInput = lenSq > 0.01;

    if (hasInput) {
      // Accelerate towards target velocity
      const targetVx = normX * this.maxSpeed;
      const targetVy = normY * this.maxSpeed;

      this.velocity.x = this.approach(this.velocity.x, targetVx, this.acceleration * deltaSeconds);
      this.velocity.y = this.approach(this.velocity.y, targetVy, this.acceleration * deltaSeconds);

      this.updateFacing(this.velocity);
    } else {
      // Decelerate to zero
      this.velocity.x = this.approach(this.velocity.x, 0, this.deceleration * deltaSeconds);
      this.velocity.y = this.approach(this.velocity.y, 0, this.deceleration * deltaSeconds);
    }

    // Integrate position
    this.position.x += this.velocity.x * deltaSeconds;
    this.position.y += this.velocity.y * deltaSeconds;
  }

  public getState(): CharacterMovementState {
    const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    return {
      position: { ...this.position },
      velocity: { ...this.velocity },
      speed,
      facing: this.facing,
      isMoving: speed > 1,
    };
  }

  public dispose(): void {
    this._isDisposed = true;
  }

  private approach(current: number, target: number, maxDelta: number): number {
    if (current < target) {
      return Math.min(current + maxDelta, target);
    } else {
      return Math.max(current - maxDelta, target);
    }
  }

  private updateFacing(vel: Vector2D): void {
    const angle = Math.atan2(vel.y, vel.x) * (180 / Math.PI); // -180 to 180

    if (angle >= -22.5 && angle < 22.5) this.facing = 'right';
    else if (angle >= 22.5 && angle < 67.5) this.facing = 'down_right';
    else if (angle >= 67.5 && angle < 112.5) this.facing = 'down';
    else if (angle >= 112.5 && angle < 157.5) this.facing = 'down_left';
    else if (angle >= 157.5 || angle < -157.5) this.facing = 'left';
    else if (angle >= -157.5 && angle < -112.5) this.facing = 'up_left';
    else if (angle >= -112.5 && angle < -67.5) this.facing = 'up';
    else if (angle >= -67.5 && angle < -22.5) this.facing = 'up_right';
  }
}

