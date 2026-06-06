import { PredictionSummary } from './prediction.models';

export enum MatchStatus {
  Open = 0,
  Closed = 1,
  Scored = 2
}

export interface MatchListItem {
  id: number;
  homeTeam: string;
  awayTeam: string;
  kickoffUtc: string;
  status: MatchStatus;
  officialHomeGoals: number | null;
  officialAwayGoals: number | null;
  hasPrediction: boolean;
  myPrediction: PredictionSummary | null;
}

export interface MatchListResponse {
  matches: MatchListItem[];
}

export const MatchStatusLabels: Record<MatchStatus, string> = {
  [MatchStatus.Open]: 'Abierto',
  [MatchStatus.Closed]: 'Cerrado',
  [MatchStatus.Scored]: 'Con resultado'
};
