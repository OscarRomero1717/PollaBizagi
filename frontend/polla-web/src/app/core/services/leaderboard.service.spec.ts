import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { LeaderboardService } from './leaderboard.service';
import { environment } from '../../../environments/environment';

describe('LeaderboardService', () => {
  let service: LeaderboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(LeaderboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch leaderboard entries', () => {
    service.getLeaderboard().subscribe((response) => {
      expect(response.entries.length).toBe(1);
      expect(response.entries[0].displayName).toBe('Usuario Demo');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/leaderboard`);
    expect(req.request.method).toBe('GET');
    req.flush({
      entries: [
        {
          rank: 1,
          userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          displayName: 'Usuario Demo',
          totalPoints: 3,
          exactHits: 1
        }
      ]
    });
  });
});
