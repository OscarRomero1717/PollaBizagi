import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { PredictionService } from './prediction.service';
import { environment } from '../../../environments/environment';

describe('PredictionService', () => {
  let service: PredictionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(PredictionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create prediction', () => {
    service
      .create({ matchId: 1, homeGoals: 2, awayGoals: 1 })
      .subscribe((response) => {
        expect(response.id).toBe(10);
      });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/predictions`);
    expect(req.request.method).toBe('POST');
    req.flush({
      id: 10,
      matchId: 1,
      homeGoals: 2,
      awayGoals: 1,
      pointsAwarded: 0,
      createdAtUtc: '2026-06-01T00:00:00Z'
    });
  });

  it('should fetch my predictions', () => {
    service.getMyPredictions().subscribe((response) => {
      expect(response.predictions.length).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/predictions/me`);
    expect(req.request.method).toBe('GET');
    req.flush({
      predictions: [
        {
          matchId: 1,
          homeTeam: 'Brasil',
          awayTeam: 'Argentina',
          predictedHomeGoals: 2,
          predictedAwayGoals: 1,
          officialHomeGoals: 2,
          officialAwayGoals: 1,
          pointsAwarded: 3,
          kickoffUtc: '2026-06-10T18:00:00Z'
        }
      ]
    });
  });

  it('should fetch user predictions', () => {
    const userId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

    service.getUserPredictions(userId).subscribe((response) => {
      expect(response.displayName).toBe('Usuario Demo');
      expect(response.predictions.length).toBe(1);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/predictions/users/${userId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({
      userId,
      displayName: 'Usuario Demo',
      predictions: [
        {
          matchId: 1,
          homeTeam: 'Brasil',
          awayTeam: 'Argentina',
          predictedHomeGoals: 2,
          predictedAwayGoals: 1,
          officialHomeGoals: 2,
          officialAwayGoals: 1,
          pointsAwarded: 3,
          kickoffUtc: '2026-06-10T18:00:00Z'
        }
      ]
    });
  });

  it('should update prediction', () => {
    service.update(10, { homeGoals: 3, awayGoals: 0 }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/predictions/10`);
    expect(req.request.method).toBe('PUT');
    req.flush({
      id: 10,
      matchId: 1,
      homeGoals: 3,
      awayGoals: 0,
      pointsAwarded: 0,
      createdAtUtc: '2026-06-01T00:00:00Z'
    });
  });
});
