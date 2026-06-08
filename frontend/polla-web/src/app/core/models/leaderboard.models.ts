export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  totalPoints: number;
  exactHits: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
}
