import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { LeaderboardPageComponent } from './leaderboard-page.component';
import { LeaderboardService } from '../../../core/services/leaderboard.service';
import { AuthService } from '../../../core/services/auth.service';

describe('LeaderboardPageComponent', () => {
  let component: LeaderboardPageComponent;
  let fixture: ComponentFixture<LeaderboardPageComponent>;
  let leaderboardService: jasmine.SpyObj<LeaderboardService>;

  beforeEach(async () => {
    leaderboardService = jasmine.createSpyObj('LeaderboardService', ['getLeaderboard']);
    const authService = jasmine.createSpyObj('AuthService', [], {
      displayName: () => 'Usuario Demo'
    });

    await TestBed.configureTestingModule({
      imports: [LeaderboardPageComponent],
      providers: [
        { provide: LeaderboardService, useValue: leaderboardService },
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderboardPageComponent);
    component = fixture.componentInstance;
  });

  it('should load leaderboard on init', () => {
    leaderboardService.getLeaderboard.and.returnValue(
      of({
        entries: [
          {
            rank: 1,
            displayName: 'Usuario Demo',
            totalPoints: 3,
            exactHits: 1
          }
        ]
      })
    );

    fixture.detectChanges();

    expect(leaderboardService.getLeaderboard).toHaveBeenCalled();
    expect(component.entries.length).toBe(1);
  });

  it('should show error when load fails', () => {
    leaderboardService.getLeaderboard.and.returnValue(throwError(() => new Error('fail')));

    fixture.detectChanges();

    expect(component.errorMessage).toContain('No fue posible cargar el leaderboard');
  });
});
