import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    localStorage.clear();
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        TokenStorageService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should login and persist session', () => {
    service.login({ email: 'user@polla.demo', password: 'User123!' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({
      token: 'abc',
      expiresAt: '2099-01-01T00:00:00Z',
      role: 'User',
      displayName: 'Usuario Demo'
    });

    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getToken()).toBe('abc');
    expect(service.displayName()).toBe('Usuario Demo');
  });

  it('should logout and clear session', () => {
    service.login({ email: 'user@polla.demo', password: 'User123!' }).subscribe();
    httpMock
      .expectOne(`${environment.apiUrl}/api/auth/login`)
      .flush({
        token: 'abc',
        expiresAt: '2099-01-01T00:00:00Z',
        role: 'User',
        displayName: 'Usuario Demo'
      });

    service.logout(false);

    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getToken()).toBeNull();
  });
});
