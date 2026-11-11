export type TimerMode = 'countdown' | 'stopwatch';

export interface TimerConfig {
  id?: string;
  mode?: TimerMode;
  /** Initial duration in seconds for countdown; defaults to 60 */
  durationSeconds?: number;
  /** Time scaling factor (e.g. 0.5 for half-speed slow-mo, 2.0 for double speed). Defaults to 1.0 */
  timeScale?: number;
  autoStart?: boolean;
}

export interface TimerState {
  id: string;
  mode: TimerMode;
  elapsedSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isExpired: boolean;
  progress: number; // 0.0 to 1.0
}

export type TimerTickListener = (state: TimerState) => void;
export type TimerExpireListener = (state: TimerState) => void;

