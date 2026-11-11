import { Circle, Rectangle } from '../../../../core/shared-types/src/index.js';

export type ColliderShape =
  | { type: 'box'; bounds: Rectangle }
  | { type: 'circle'; bounds: Circle };

export interface Collider {
  id: string;
  shape: ColliderShape;
  layer?: number; // Bitmask layer
  mask?: number; // Bitmask mask
  isTrigger?: boolean;
}

export interface CollisionPair {
  a: Collider;
  b: Collider;
}
