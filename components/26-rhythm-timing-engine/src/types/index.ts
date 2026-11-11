export type HitRating = 'perfect' | 'great' | 'good' | 'miss';

export interface BeatNote {
  id: string;
  targetTimeMs: number;
  trackIndex: number;
  isHit?: boolean;
}

export interface RhythmTimingConfig {
  bpm?: number;
  perfectWindowMs?: number; // default 50ms
  greatWindowMs?: number; // default 100ms
  goodWindowMs?: number; // default 160ms
}

export interface NoteHitResult {
  noteId?: string;
  rating: HitRating;
  timeDeltaMs: number;
  combo: number;
  scoreAwarded: number;
}

export interface RhythmState {
  currentTimeMs: number;
  combo: number;
  maxCombo: number;
  score: number;
  notesHit: number;
  notesMissed: number;
  accuracy: number; // 0.0 to 1.0
}

