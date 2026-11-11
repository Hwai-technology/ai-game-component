export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  score: number;
  timestamp: number;
}

export interface ILeaderboardBackend {
  submitScore(playerId: string, playerName: string, score: number): Promise<LeaderboardEntry>;
  getTopScores(limit: number, offset?: number): Promise<LeaderboardEntry[]>;
  getPlayerRank(playerId: string): Promise<LeaderboardEntry | null>;
}
