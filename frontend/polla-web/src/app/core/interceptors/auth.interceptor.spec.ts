import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should attach bearer token when available', () => {
    authService.getToken.and.returnValue('jwt-123');

    http.get('/api/matches').subscribe();

    const req = httpMock.expectOne('/api/matches');
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-123');
  });

  it('should not attach bearer token when missing', () => {
    authService.getToken.and.returnValue(null);

    http.get('/api/matches').subscribe();

    const req = httpMock.expectOne('/api/matches');
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });
});
