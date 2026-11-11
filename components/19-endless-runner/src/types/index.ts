export type RunnerLane = 0 | 1 | 2; // Left (0), Center (1), Right (2)
export type RunnerAction = 'jump' | 'slide' | 'lane_left' | 'lane_right';

export interface EndlessRunnerConfig {
  initialSpeed?: number; // pixels/sec or units/sec (default 200)
  maxSpeed?: number; // default 800
  acceleration?: number; // units/sec per second (default 5)
  lanesCount?: number; // default 3
}

export interface EndlessRunnerState {
  lane: RunnerLane;
  isJumping: boolean;
  isSliding: boolean;
  distance: number;
  currentSpeed: number;
  isGameOver: boolean;
}
