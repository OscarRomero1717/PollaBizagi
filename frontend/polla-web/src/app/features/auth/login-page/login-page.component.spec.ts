import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit when form is invalid', () => {
    component.submit();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should call auth service on valid submit', () => {
    authService.login.and.returnValue(
      of({
        token: 'x',
        expiresAt: '2099-01-01T00:00:00Z',
        role: 'User',
        displayName: 'Demo'
      })
    );

    component.form.setValue({
      email: 'user@polla.demo',
      password: 'User123!'
    });

    component.submit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'user@polla.demo',
      password: 'User123!'
    });
  });

  it('should show api error message', () => {
    authService.login.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' }
          })
      )
    );

    component.form.setValue({
      email: 'user@polla.demo',
      password: 'bad'
    });

    component.submit();

    expect(component.errorMessage).toBe('Invalid email or password.');
  });
});
