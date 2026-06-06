export interface SetOfficialResultRequest {
  homeGoals: number;
  awayGoals: number;
}

export interface SetOfficialResultResponse {
  matchId: number;
  officialHomeGoals: number;
  officialAwayGoals: number;
  predictionsUpdated: number;
}
