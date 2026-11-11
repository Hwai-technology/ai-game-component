import { Disposable } from '../../../../core/shared-types/src/index.js';
import { ILeaderboardBackend, LeaderboardEntry } from '../types/index.js';

export class LocalMemoryLeaderboardBackend implements ILeaderboardBackend {
  private entries: { playerId: string; playerName: string; score: number; timestamp: number }[] = [];

  public async submitScore(playerId: string, playerName: string, score: number): Promise<LeaderboardEntry> {
    const existing = this.entries.find((e) => e.playerId === playerId);
    if (existing) {
      if (score > existing.score) {
        existing.score = score;
        existing.timestamp = Date.now();
      }
    } else {
      this.entries.push({ playerId, playerName, score, timestamp: Date.now() });
    }

    // Sort descending by score, then ascending by timestamp
    this.entries.sort((a, b) => (b.score !== a.score ? b.score - a.score : a.timestamp - b.timestamp));

    const rank = this.entries.findIndex((e) => e.playerId === playerId) + 1;
    const playerEntry = this.entries[rank - 1]!;

    return {
      rank,
      ...playerEntry,
    };
  }

  public async getTopScores(limit = 10, offset = 0): Promise<LeaderboardEntry[]> {
    return this.entries.slice(offset, offset + limit).map((e, idx) => ({
      rank: offset + idx + 1,
      ...e,
    }));
  }

  public async getPlayerRank(playerId: string): Promise<LeaderboardEntry | null> {
    const idx = this.entries.findIndex((e) => e.playerId === playerId);
    if (idx === -1) return null;
    return {
      rank: idx + 1,
      ...this.entries[idx]!,
    };
  }
}

export class LeaderboardAdapter implements Disposable {
  private readonly backend: ILeaderboardBackend;
  private _isDisposed = false;

  constructor(backend: ILeaderboardBackend = new LocalMemoryLeaderboardBackend()) {
    this.backend = backend;
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public async submitScore(playerId: string, playerName: string, score: number): Promise<LeaderboardEntry> {
    return this.backend.submitScore(playerId, playerName, score);
  }

  public async getTopScores(limit = 10, offset = 0): Promise<LeaderboardEntry[]> {
    return this.backend.getTopScores(limit, offset);
  }

  public async getPlayerRank(playerId: string): Promise<LeaderboardEntry | null> {
    return this.backend.getPlayerRank(playerId);
  }

  public dispose(): void {
    this._isDisposed = true;
  }
}

