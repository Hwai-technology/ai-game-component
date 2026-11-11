export type SessionStatus = 'idle' | 'active' | 'paused' | 'ended';

export interface GameSessionData {
  sessionId: string;
  userId?: string;
  status: SessionStatus;
  startTime: number;
  endTime?: number;
  durationMs: number;
  pauseTimeAccumulatorMs: number;
  metrics: Record<string, number | string | boolean>;
  tags: string[];
}

export interface SessionConfig {
  userId?: string;
  tags?: string[];
  autoStart?: boolean;
}

