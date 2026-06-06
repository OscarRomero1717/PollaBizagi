import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  SetOfficialResultRequest,
  SetOfficialResultResponse
} from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  setOfficialResult(
    matchId: number,
    request: SetOfficialResultRequest
  ): Observable<SetOfficialResultResponse> {
    return this.http.put<SetOfficialResultResponse>(
      `${environment.apiUrl}/api/admin/matches/${matchId}/result`,
      request
    );
  }
}
