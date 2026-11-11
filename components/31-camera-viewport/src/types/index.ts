import { Dimensions2D, Rectangle, Vector2D } from '../../../../core/shared-types/src/index.js';

export interface CameraConfig {
  viewport: Dimensions2D;
  worldBounds?: Rectangle;
  deadzone?: Dimensions2D;
  lerpSpeed?: number; // 0 to 1 (e.g. 0.1 for smooth catchup)
}

export interface CameraState {
  position: Vector2D; // Top-left position of camera in world space
  center: Vector2D; // Center of camera in world space
  viewport: Dimensions2D;
}
