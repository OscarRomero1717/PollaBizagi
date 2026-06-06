import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PredictionFormComponent } from './prediction-form.component';
import { PredictionService } from '../../../core/services/prediction.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatchStatus } from '../../../core/models/match.models';
import { RoleNames } from '../../../core/models/roles';

describe('PredictionFormComponent', () => {
  let component: PredictionFormComponent;
  let fixture: ComponentFixture<PredictionFormComponent>;
  let predictionService: jasmine.SpyObj<PredictionService>;

  const openMatch = {
    id: 1,
    homeTeam: 'Brasil',
    awayTeam: 'Argentina',
    kickoffUtc: '2026-06-10T18:00:00Z',
    status: MatchStatus.Open,
    officialHomeGoals: null,
    officialAwayGoals: null,
    hasPrediction: false,
    myPrediction: null
  };

  beforeEach(async () => {
    predictionService = jasmine.createSpyObj('PredictionService', ['create', 'update']);
    const authService = jasmine.createSpyObj('AuthService', [], {
      role: () => RoleNames.User
    });

    await TestBed.configureTestingModule({
      imports: [PredictionFormComponent],
      providers: [
        { provide: PredictionService, useValue: predictionService },
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PredictionFormComponent);
    component = fixture.componentInstance;
    component.match = openMatch;
    fixture.detectChanges();
  });

  it('should create prediction for open match', () => {
    predictionService.create.and.returnValue(
      of({
        id: 1,
        matchId: 1,
        homeGoals: 2,
        awayGoals: 1,
        pointsAwarded: 0,
        createdAtUtc: '2026-06-01T00:00:00Z'
      })
    );

    spyOn(component.saved, 'emit');
    component.form.setValue({ homeGoals: 2, awayGoals: 1 });
    component.submit();

    expect(predictionService.create).toHaveBeenCalledWith({
      matchId: 1,
      homeGoals: 2,
      awayGoals: 1
    });
    expect(component.saved.emit).toHaveBeenCalled();
  });
});
