import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { MatchListItem, MatchStatus } from '../../../core/models/match.models';
import { AdminService } from '../../../core/services/admin.service';
import { getHttpErrorMessage } from '../../../core/utils/http-error.util';

@Component({
  selector: 'app-official-result-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './official-result-form.component.html',
  styleUrl: './official-result-form.component.scss'
})
export class OfficialResultFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);

  @Input({ required: true }) match!: MatchListItem;
  @Output() readonly saved = new EventEmitter<string>();

  submitting = false;
  errorMessage: string | null = null;

  readonly MatchStatus = MatchStatus;

  readonly form = this.fb.nonNullable.group({
    homeGoals: [0, [Validators.required, Validators.min(0)]],
    awayGoals: [0, [Validators.required, Validators.min(0)]]
  });

  get isScored(): boolean {
    return this.match.status === MatchStatus.Scored;
  }

  ngOnChanges(): void {
    this.errorMessage = null;

    if (
      this.match.officialHomeGoals !== null &&
      this.match.officialAwayGoals !== null
    ) {
      this.form.setValue({
        homeGoals: this.match.officialHomeGoals,
        awayGoals: this.match.officialAwayGoals
      });
    } else {
      this.form.reset({ homeGoals: 0, awayGoals: 0 });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    const { homeGoals, awayGoals } = this.form.getRawValue();

    this.adminService
      .setOfficialResult(this.match.id, { homeGoals, awayGoals })
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (response) => {
          this.saved.emit(
            `Resultado guardado. ${response.predictionsUpdated} predicción(es) actualizada(s).`
          );
        },
        error: (error) => {
          this.errorMessage = getHttpErrorMessage(
            error,
            'No fue posible guardar el resultado oficial.'
          );
        }
      });
  }
}
