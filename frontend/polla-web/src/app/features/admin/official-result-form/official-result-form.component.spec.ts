import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OfficialResultFormComponent } from './official-result-form.component';
import { AdminService } from '../../../core/services/admin.service';
import { MatchStatus } from '../../../core/models/match.models';

describe('OfficialResultFormComponent', () => {
  let component: OfficialResultFormComponent;
  let fixture: ComponentFixture<OfficialResultFormComponent>;
  let adminService: jasmine.SpyObj<AdminService>;

  const match = {
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
    adminService = jasmine.createSpyObj('AdminService', ['setOfficialResult']);

    await TestBed.configureTestingModule({
      imports: [OfficialResultFormComponent],
      providers: [{ provide: AdminService, useValue: adminService }]
    }).compileComponents();

    fixture = TestBed.createComponent(OfficialResultFormComponent);
    component = fixture.componentInstance;
    component.match = match;
    fixture.detectChanges();
  });

  it('should publish official result', () => {
    adminService.setOfficialResult.and.returnValue(
      of({
        matchId: 1,
        officialHomeGoals: 2,
        officialAwayGoals: 1,
        predictionsUpdated: 1
      })
    );

    spyOn(component.saved, 'emit');
    component.form.setValue({ homeGoals: 2, awayGoals: 1 });
    component.submit();

    expect(adminService.setOfficialResult).toHaveBeenCalledWith(1, {
      homeGoals: 2,
      awayGoals: 1
    });
    expect(component.saved.emit).toHaveBeenCalled();
  });
});
