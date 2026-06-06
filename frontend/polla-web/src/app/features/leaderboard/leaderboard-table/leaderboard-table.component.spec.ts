import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaderboardTableComponent } from './leaderboard-table.component';

describe('LeaderboardTableComponent', () => {
  let fixture: ComponentFixture<LeaderboardTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderboardTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderboardTableComponent);
    fixture.componentInstance.entries = [
      {
        rank: 1,
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
