import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatchesPageComponent } from './matches-page.component';
import { MatchService } from '../../../core/services/match.service';
import { MatchStatus } from '../../../core/models/match.models';

describe('MatchesPageComponent', () => {
  let component: MatchesPageComponent;
  let fixture: ComponentFixture<MatchesPageComponent>;
  let matchService: jasmine.SpyObj<MatchService>;

  beforeEach(async () => {
    matchService = jasmine.createSpyObj('MatchService', ['getMatches']);

    await TestBed.configureTestingModule({
      imports: [MatchesPageComponent, HttpClientTestingModule],
      providers: [{ provide: MatchService, useValue: matchService }]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchesPageComponent);
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

  it('should show error when load fails', () => {
    matchService.getMatches.and.returnValue(throwError(() => new Error('fail')));

    fixture.detectChanges();

    expect(component.errorMessage).toContain('No fue posible cargar los partidos');
  });
});
