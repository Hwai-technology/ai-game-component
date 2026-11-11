import { Vector2D } from '../../../../core/shared-types/src/index.js';

export interface CollectibleItem {
  id: string;
  type: string;
  position: Vector2D;
  value: number;
  isCollected: boolean;
  magnetized?: boolean;
}

export interface IHapticDriver {
  impactAsync(style?: 'light' | 'medium' | 'heavy'): Promise<void> | void;
}

export interface CollectibleConfig {
  collectionRadius?: number; // Distance in pixels/units to trigger pickup
  hapticDriver?: IHapticDriver;
}

export interface CollectionEvent {
  item: CollectibleItem;
  valueAwarded: number;
  totalCollectedCount: number;
  totalValue: number;
}

