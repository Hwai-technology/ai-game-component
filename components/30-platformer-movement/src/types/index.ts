import { Vector2D } from '../../../../core/shared-types/src/index.js';

export interface PlatformerConfig {
  runSpeed?: number; // max horizontal speed (default 250 px/s)
  acceleration?: number; // default 1200 px/s^2
  jumpVelocity?: number; // initial upward impulse (default -450 px/s)
  gravity?: number; // downward acceleration (default 1200 px/s^2)
  maxDoubleJumps?: number; // default 1 (for 1 extra jump in air)
  coyoteTimeSeconds?: number; // default 0.12s
  jumpBufferSeconds?: number; // default 0.1s
}

export interface PlatformerState {
  position: Vector2D;
  velocity: Vector2D;
  isGrounded: boolean;
  isJumping: boolean;
  canDoubleJump: boolean;
}

