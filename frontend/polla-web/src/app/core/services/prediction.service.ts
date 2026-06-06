import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreatePredictionRequest,
  MyPredictionsResponse,
  PredictionResponse,
  UpdatePredictionRequest
} from '../models/prediction.models';

@Injectable({ providedIn: 'root' })
export class PredictionService {
  private readonly http = inject(HttpClient);

  create(request: CreatePredictionRequest): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(
      `${environment.apiUrl}/api/predictions`,
      request
    );
  }

  update(
    predictionId: number,
    request: UpdatePredictionRequest
  ): Observable<PredictionResponse> {
    return this.http.put<PredictionResponse>(
      `${environment.apiUrl}/api/predictions/${predictionId}`,
      request
    );
  }

  getMyPredictions(): Observable<MyPredictionsResponse> {
    return this.http.get<MyPredictionsResponse>(
      `${environment.apiUrl}/api/predictions/me`
    );
  }
}
