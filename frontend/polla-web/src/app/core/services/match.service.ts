import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatchListResponse } from '../models/match.models';

@Injectable({ providedIn: 'root' })
export class MatchService {
  private readonly http = inject(HttpClient);

  getMatches(): Observable<MatchListResponse> {
    return this.http.get<MatchListResponse>(`${environment.apiUrl}/api/matches`);
  }
}
