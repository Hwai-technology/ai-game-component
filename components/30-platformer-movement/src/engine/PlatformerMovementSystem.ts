import { Disposable, Vector2D } from '../../../../core/shared-types/src/index.js';
import { PlatformerConfig, PlatformerState } from '../types/index.js';

export class PlatformerMovementSystem implements Disposable {
  private position: Vector2D = { x: 0, y: 0 };
  private velocity: Vector2D = { x: 0, y: 0 };
  private isGrounded = false;
  private jumpsRemaining = 1;
  private coyoteTimer = 0;
  private jumpBufferTimer = 0;

  private readonly runSpeed: number;
  private readonly acceleration: number;
  private readonly jumpVelocity: number;
  private readonly gravity: number;
  private readonly maxDoubleJumps: number;
  private readonly coyoteTime: number;
  private readonly jumpBufferTime: number;
  private _isDisposed = false;

  constructor(config: PlatformerConfig = {}, initialPos: Vector2D = { x: 0, y: 0 }) {
    this.runSpeed = config.runSpeed ?? 250;
    this.acceleration = config.acceleration ?? 1200;
    this.jumpVelocity = config.jumpVelocity ?? -450;
    this.gravity = config.gravity ?? 1200;
    this.maxDoubleJumps = config.maxDoubleJumps ?? 1;
    this.coyoteTime = config.coyoteTimeSeconds ?? 0.12;
    this.jumpBufferTime = config.jumpBufferSeconds ?? 0.1;
    this.position = { ...initialPos };
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public requestJump(): void {
    if (this._isDisposed) return;
    this.jumpBufferTimer = this.jumpBufferTime;
  }

  public step(deltaSeconds: number, horizontalInput: number, floorY: number): void {
    if (this._isDisposed || deltaSeconds <= 0) return;

    // 1. Horizontal movement
    const targetVx = horizontalInput * this.runSpeed;
    if (this.velocity.x < targetVx) {
      this.velocity.x = Math.min(this.velocity.x + this.acceleration * deltaSeconds, targetVx);
    } else if (this.velocity.x > targetVx) {
      this.velocity.x = Math.max(this.velocity.x - this.acceleration * deltaSeconds, targetVx);
    }

    // 2. Gravity
    this.velocity.y += this.gravity * deltaSeconds;

    // 3. Coyote time and buffer timers
    if (this.isGrounded) {
      this.coyoteTimer = this.coyoteTime;
      this.jumpsRemaining = this.maxDoubleJumps;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - deltaSeconds);
    }
    this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - deltaSeconds);

    // 4. Jump execution
    if (this.jumpBufferTimer > 0) {
      if (this.isGrounded || this.coyoteTimer > 0) {
        this.executeJump();
      } else if (this.jumpsRemaining > 0) {
        this.jumpsRemaining--;
        this.executeJump();
      }
    }

    // 5. Integrate position
    this.position.x += this.velocity.x * deltaSeconds;
    this.position.y += this.velocity.y * deltaSeconds;

    // 6. Ground collision check against floor plane
    if (this.position.y >= floorY) {
      this.position.y = floorY;
      this.velocity.y = 0;
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }
  }

  public getState(): PlatformerState {
    return {
      position: { ...this.position },
      velocity: { ...this.velocity },
      isGrounded: this.isGrounded,
      isJumping: this.velocity.y < 0,
      canDoubleJump: !this.isGrounded && this.jumpsRemaining > 0,
    };
  }

  public dispose(): void {
    this._isDisposed = true;
  }

  private executeJump(): void {
    this.velocity.y = this.jumpVelocity;
    this.isGrounded = false;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
  }
}

