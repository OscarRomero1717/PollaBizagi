import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavBarComponent } from './nav-bar.component';
import { AuthService } from '../../core/services/auth.service';
import { RoleNames } from '../../core/models/roles';

describe('NavBarComponent', () => {
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    const authService = jasmine.createSpyObj('AuthService', ['logout'], {
      displayName: () => 'Usuario Demo',
      isAdmin: () => false
    });

    await TestBed.configureTestingModule({
      imports: [NavBarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    fixture.detectChanges();
  });

  it('should render main navigation links', () => {
    const links = fixture.nativeElement.querySelectorAll('.nav-link');
    const labels = Array.from(links as NodeListOf<Element>).map((link) =>
      link.textContent?.trim()
    );

    expect(labels).toContain('Partidos');
    expect(labels).toContain('Mis predicciones');
    expect(labels).toContain('Leaderboard');
    expect(labels).not.toContain('Admin');
  });
});

describe('NavBarComponent admin', () => {
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    const authService = jasmine.createSpyObj('AuthService', ['logout'], {
      displayName: () => 'Administrador',
      isAdmin: () => true,
      role: () => RoleNames.Admin
    });

    await TestBed.configureTestingModule({
      imports: [NavBarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    fixture.detectChanges();
  });

  it('should render admin link for admin users', () => {
    const links = fixture.nativeElement.querySelectorAll('.nav-link');
    const labels = Array.from(links as NodeListOf<Element>).map((link) =>
      link.textContent?.trim()
    );

    expect(labels).toContain('Admin');
  });
});
