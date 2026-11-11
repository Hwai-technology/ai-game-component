import { Rectangle } from '../../../../core/shared-types/src/index.js';

export type ObstacleType = 'low_barrier' | 'high_barrier' | 'lane_blocker';

export interface GameObstacle {
  id: string;
  type: ObstacleType;
  lane: number;
  bounds: Rectangle;
  isActive: boolean;
}

export interface ObstacleGeneratorConfig {
  spawnIntervalMeters?: number; // default 50
  lanesCount?: number; // default 3
  laneWidth?: number; // default 100
}

