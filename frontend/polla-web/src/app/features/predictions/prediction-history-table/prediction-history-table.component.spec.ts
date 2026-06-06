import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PredictionHistoryTableComponent } from './prediction-history-table.component';

describe('PredictionHistoryTableComponent', () => {
  let fixture: ComponentFixture<PredictionHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PredictionHistoryTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PredictionHistoryTableComponent);
    fixture.componentInstance.predictions = [
      {
        matchId: 1,
        homeTeam: 'Brasil',
        awayTeam: 'Argentina',
        predictedHomeGoals: 2,
        predictedAwayGoals: 1,
        officialHomeGoals: null,
        officialAwayGoals: null,
        pointsAwarded: 0,
        kickoffUtc: '2026-06-10T18:00:00Z'
      }
    ];
    fixture.detectChanges();
  });

  it('should render pending official result', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Pendiente');
    expect(text).toContain('—');
  });
});
