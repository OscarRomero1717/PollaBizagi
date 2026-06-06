import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { environment } from '../../../environments/environment';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should set official result', () => {
    service.setOfficialResult(1, { homeGoals: 2, awayGoals: 1 }).subscribe((response) => {
      expect(response.predictionsUpdated).toBe(3);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/admin/matches/1/result`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ homeGoals: 2, awayGoals: 1 });
    req.flush({
      matchId: 1,
      officialHomeGoals: 2,
      officialAwayGoals: 1,
      predictionsUpdated: 3
    });
  });
});
