import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { MatchService } from './match.service';
import { environment } from '../../../environments/environment';
import { MatchStatus } from '../models/match.models';

describe('MatchService', () => {
  let service: MatchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(MatchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch matches', () => {
    service.getMatches().subscribe((response) => {
      expect(response.matches.length).toBe(1);
      expect(response.matches[0].homeTeam).toBe('Brasil');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/matches`);
    expect(req.request.method).toBe('GET');
    req.flush({
      matches: [
        {
          id: 1,
          homeTeam: 'Brasil',
          awayTeam: 'Argentina',
          kickoffUtc: '2026-06-10T18:00:00Z',
          status: MatchStatus.Open,
          officialHomeGoals: null,
          officialAwayGoals: null,
          hasPrediction: false,
          myPrediction: null
        }
      ]
    });
  });
});
