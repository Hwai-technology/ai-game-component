import { Disposable } from '../../../../core/shared-types/src/index.js';
import { BeatNote, HitRating, NoteHitResult, RhythmState, RhythmTimingConfig } from '../types/index.js';

export class RhythmTimingEngine implements Disposable {
  private readonly perfectWindowMs: number;
  private readonly greatWindowMs: number;
  private readonly goodWindowMs: number;

  private notes: BeatNote[] = [];
  private currentTimeMs = 0;
  private combo = 0;
  private maxCombo = 0;
  private score = 0;
  private notesHit = 0;
  private notesMissed = 0;
  private _isDisposed = false;

  constructor(config: RhythmTimingConfig = {}) {
    this.perfectWindowMs = config.perfectWindowMs ?? 50;
    this.greatWindowMs = config.greatWindowMs ?? 100;
    this.goodWindowMs = config.goodWindowMs ?? 160;
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public loadTrack(notes: BeatNote[]): void {
    this.notes = notes.map((n) => ({ ...n, isHit: false }));
    this.reset();
  }

  public step(deltaSeconds: number): NoteHitResult[] {
    if (this._isDisposed) return [];

    this.currentTimeMs += deltaSeconds * 1000;
    const autoMisses: NoteHitResult[] = [];

    // Check for expired notes (notes that passed goodWindowMs without user tap)
    for (const note of this.notes) {
      if (!note.isHit && this.currentTimeMs - note.targetTimeMs > this.goodWindowMs) {
        note.isHit = true;
        this.combo = 0;
        this.notesMissed++;

        autoMisses.push({
          noteId: note.id,
          rating: 'miss',
          timeDeltaMs: this.currentTimeMs - note.targetTimeMs,
          combo: 0,
          scoreAwarded: 0,
        });
      }
    }

    return autoMisses;
  }

  public triggerTap(trackIndex: number): NoteHitResult {
    if (this._isDisposed) {
      return { rating: 'miss', timeDeltaMs: 0, combo: 0, scoreAwarded: 0 };
    }

    // Find the closest unhit note on this track
    let closestNote: BeatNote | null = null;
    let minDelta = Infinity;

    for (const note of this.notes) {
      if (!note.isHit && note.trackIndex === trackIndex) {
        const delta = Math.abs(this.currentTimeMs - note.targetTimeMs);
        if (delta < minDelta) {
          minDelta = delta;
          closestNote = note;
        }
      }
    }

    if (!closestNote || minDelta > this.goodWindowMs) {
      // Tapped with no note in range -> miss or empty tap
      return {
        rating: 'miss',
        timeDeltaMs: minDelta === Infinity ? 0 : minDelta,
        combo: 0,
        scoreAwarded: 0,
      };
    }

    closestNote.isHit = true;
    let rating: HitRating = 'good';
    let baseScore = 50;

    if (minDelta <= this.perfectWindowMs) {
      rating = 'perfect';
      baseScore = 300;
    } else if (minDelta <= this.greatWindowMs) {
      rating = 'great';
      baseScore = 150;
    }

    this.combo++;
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }
    this.notesHit++;

    const comboMultiplier = 1 + Math.floor(this.combo / 10) * 0.1;
    const scoreAwarded = Math.round(baseScore * comboMultiplier);
    this.score += scoreAwarded;

    return {
      noteId: closestNote.id,
      rating,
      timeDeltaMs: minDelta,
      combo: this.combo,
      scoreAwarded,
    };
  }

  public getState(): RhythmState {
    const totalProcessed = this.notesHit + this.notesMissed;
    const accuracy = totalProcessed > 0 ? this.notesHit / totalProcessed : 1.0;

    return {
      currentTimeMs: this.currentTimeMs,
      combo: this.combo,
      maxCombo: this.maxCombo,
      score: this.score,
      notesHit: this.notesHit,
      notesMissed: this.notesMissed,
      accuracy,
    };
  }

  public reset(): void {
    this.currentTimeMs = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.score = 0;
    this.notesHit = 0;
    this.notesMissed = 0;
    for (const n of this.notes) n.isHit = false;
  }

  public dispose(): void {
    this._isDisposed = true;
    this.notes.length = 0;
  }
}

