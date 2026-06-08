export interface PredictionSummary {
  id: number;
  homeGoals: number;
  awayGoals: number;
  pointsAwarded: number;
}

export interface CreatePredictionRequest {
  matchId: number;
  homeGoals: number;
  awayGoals: number;
}

export interface UpdatePredictionRequest {
  homeGoals: number;
  awayGoals: number;
}

export interface PredictionResponse {
  id: number;
  matchId: number;
  homeGoals: number;
  awayGoals: number;
  pointsAwarded: number;
  createdAtUtc: string;
}

export interface MyPredictionItem {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  predictedHomeGoals: number;
  predictedAwayGoals: number;
  officialHomeGoals: number | null;
  officialAwayGoals: number | null;
  pointsAwarded: number;
  kickoffUtc: string;
}

export interface MyPredictionsResponse {
  predictions: MyPredictionItem[];
}

export interface UserPredictionsResponse {
  userId: string;
  displayName: string;
  predictions: MyPredictionItem[];
}
