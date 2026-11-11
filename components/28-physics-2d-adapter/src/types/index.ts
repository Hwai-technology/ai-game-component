import { Vector2D } from '../../../../core/shared-types/src/index.js';

export interface RigidBody2D {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
  mass: number; // 0 for static/immovable bodies
  restitution: number; // 0 (inelastic) to 1 (elastic bounce)
  friction: number; // 0 to 1
  gravityScale: number;
  isStatic?: boolean;
}

export interface PhysicsWorldConfig {
  gravity?: Vector2D; // default { x: 0, y: 980 } px/s^2
  airResistance?: number; // 0 to 1
}

