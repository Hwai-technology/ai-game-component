export interface GameLoopConfig {
  /** Target frames per second for update calls. Defaults to 60. */
  fps?: number;
  /** Whether to use a fixed timestep accumulator. Defaults to true. */
  fixedTimestep?: boolean;
  /** Maximum allowable delta time in seconds to prevent spiral of death. Defaults to 0.1 (100ms). */
  maxDeltaTime?: number;
  /** Whether to start running immediately upon construction. Defaults to false. */
  autoStart?: boolean;
}

export interface GameLoopTickPayload {
  /** Elapsed time since last tick in seconds */
  deltaTime: number;
  /** Total elapsed running time in seconds */
  totalTime: number;
  /** Current calculated frames per second */
  currentFps: number;
  /** Monotonic frame count */
  frameCount: number;
}

export type GameLoopUpdateCallback = (payload: GameLoopTickPayload) => void;

export type GameLoopRenderCallback = (interpolation: number) => void;

export interface GameLoopState {
  isRunning: boolean;
  isPaused: boolean;
  frameCount: number;
  totalTime: number;
  fps: number;
}

