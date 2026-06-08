import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LeaderboardTableComponent } from './leaderboard-table.component';

describe('LeaderboardTableComponent', () => {
  let fixture: ComponentFixture<LeaderboardTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderboardTableComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderboardTableComponent);
    fixture.componentInstance.entries = [
      {
        rank: 1,
        userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        displayName: 'Usuario Demo',
        totalPoints: 3,
        exactHits: 1
      }
    ];
    fixture.componentInstance.highlightName = 'Usuario Demo';
    fixture.detectChanges();
  });

  it('should highlight current user row', () => {
    const row = fixture.nativeElement.querySelector('tr.is-current');
    expect(row).toBeTruthy();
    expect(row.textContent).toContain('Usuario Demo');
  });
});
