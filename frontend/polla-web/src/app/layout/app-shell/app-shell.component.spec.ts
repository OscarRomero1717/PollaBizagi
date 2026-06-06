import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppShellComponent } from './app-shell.component';
import { AuthService } from '../../core/services/auth.service';

describe('AppShellComponent', () => {
  let fixture: ComponentFixture<AppShellComponent>;

  beforeEach(async () => {
    const authService = jasmine.createSpyObj('AuthService', ['logout'], {
      displayName: () => 'Usuario Demo',
      isAdmin: () => false
    });

    await TestBed.configureTestingModule({
      imports: [AppShellComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();
  });

  it('should render navbar and content outlet', () => {
    expect(fixture.nativeElement.querySelector('app-nav-bar')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('main.app-shell__content')).toBeTruthy();
  });
});
