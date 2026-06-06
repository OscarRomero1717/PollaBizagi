import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminResultsPageComponent } from './admin-results-page.component';
import { MatchService } from '../../../core/services/match.service';
import { MatchStatus } from '../../../core/models/match.models';

describe('AdminResultsPageComponent', () => {
  let component: AdminResultsPageComponent;
  let fixture: ComponentFixture<AdminResultsPageComponent>;
  let matchService: jasmine.SpyObj<MatchService>;

  beforeEach(async () => {
    matchService = jasmine.createSpyObj('MatchService', ['getMatches']);

    await TestBed.configureTestingModule({
      imports: [AdminResultsPageComponent, HttpClientTestingModule],
      providers: [{ provide: MatchService, useValue: matchService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminResultsPageComponent);
    component = fixture.componentInstance;
  });

  it('should load matches on init', () => {
    matchService.getMatches.and.returnValue(
      of({
        matches: [
          {
            id: 1,
            homeTeam: 'Brasil',
            awayTeam: 'Argentina',
            kickoffUtc: '2026-06-10T18:00:00Z',
            status: MatchStatus.Open,
            officialHomeGoals: null,
            officialAwayGoals: null,
            hasPrediction: false,
            myPrediction: null
          }
        ]
      })
    );

    fixture.detectChanges();

    expect(matchService.getMatches).toHaveBeenCalled();
    expect(component.matches.length).toBe(1);
  });

  it('should show success message and reload after save', () => {
    matchService.getMatches.and.returnValue(of({ matches: [] }));

    component.onResultSaved('Resultado guardado. 2 predicción(es) actualizada(s).');

    expect(component.successMessage).toContain('Resultado guardado');
    expect(matchService.getMatches).toHaveBeenCalled();
  });
});
