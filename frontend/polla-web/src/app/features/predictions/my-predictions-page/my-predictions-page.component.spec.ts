import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MyPredictionsPageComponent } from './my-predictions-page.component';
import { PredictionService } from '../../../core/services/prediction.service';

describe('MyPredictionsPageComponent', () => {
  let component: MyPredictionsPageComponent;
  let fixture: ComponentFixture<MyPredictionsPageComponent>;
  let predictionService: jasmine.SpyObj<PredictionService>;

  beforeEach(async () => {
    predictionService = jasmine.createSpyObj('PredictionService', ['getMyPredictions']);

    await TestBed.configureTestingModule({
      imports: [MyPredictionsPageComponent],
      providers: [
        provideRouter([]),
        { provide: PredictionService, useValue: predictionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyPredictionsPageComponent);
    component = fixture.componentInstance;
  });

  it('should load predictions on init', () => {
    predictionService.getMyPredictions.and.returnValue(
      of({
        predictions: [
          {
            matchId: 1,
            homeTeam: 'Brasil',
            awayTeam: 'Argentina',
            predictedHomeGoals: 2,
            predictedAwayGoals: 1,
            officialHomeGoals: 2,
            officialAwayGoals: 1,
            pointsAwarded: 3,
            kickoffUtc: '2026-06-10T18:00:00Z'
          }
        ]
      })
    );

    fixture.detectChanges();

    expect(predictionService.getMyPredictions).toHaveBeenCalled();
    expect(component.predictions.length).toBe(1);
    expect(component.totalPoints).toBe(3);
  });

  it('should ignore pending matches in total points', () => {
    predictionService.getMyPredictions.and.returnValue(
      of({
        predictions: [
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
        ]
      })
    );

    fixture.detectChanges();

    expect(component.totalPoints).toBe(0);
  });

  it('should show error when load fails', () => {
    predictionService.getMyPredictions.and.returnValue(throwError(() => new Error('fail')));

    fixture.detectChanges();

    expect(component.errorMessage).toContain('No fue posible cargar tus predicciones');
  });
});
