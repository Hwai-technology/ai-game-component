import { Vector2D } from '../../../../core/shared-types/src/index.js';

export type FacingDirection = 'up' | 'down' | 'left' | 'right' | 'up_left' | 'up_right' | 'down_left' | 'down_right';

export interface MovementConfig {
  maxSpeed?: number; // default 200 px/s
  acceleration?: number; // default 800 px/s^2
  deceleration?: number; // default 1000 px/s^2
}

export interface CharacterMovementState {
  position: Vector2D;
  velocity: Vector2D;
  speed: number;
  facing: FacingDirection;
  isMoving: boolean;
}

