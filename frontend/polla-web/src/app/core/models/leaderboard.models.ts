export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  totalPoints: number;
  exactHits: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
}
