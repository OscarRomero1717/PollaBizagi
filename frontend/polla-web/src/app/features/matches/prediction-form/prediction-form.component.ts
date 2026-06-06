import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { MatchListItem, MatchStatus } from '../../../core/models/match.models';
import { RoleNames } from '../../../core/models/roles';
import { PredictionService } from '../../../core/services/prediction.service';
import { AuthService } from '../../../core/services/auth.service';
import { getHttpErrorMessage } from '../../../core/utils/http-error.util';

@Component({
  selector: 'app-prediction-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './prediction-form.component.html',
  styleUrl: './prediction-form.component.scss'
})
export class PredictionFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly predictionService = inject(PredictionService);
  private readonly authService = inject(AuthService);

  @Input({ required: true }) match!: MatchListItem;
  @Output() readonly saved = new EventEmitter<void>();

  submitting = false;
  errorMessage: string | null = null;

  readonly form = this.fb.nonNullable.group({
    homeGoals: [0, [Validators.required, Validators.min(0)]],
    awayGoals: [0, [Validators.required, Validators.min(0)]]
  });

  readonly MatchStatus = MatchStatus;

  get canPredict(): boolean {
    return (
      this.authService.role() === RoleNames.User &&
      this.match.status === MatchStatus.Open
    );
  }

  get isEditMode(): boolean {
    return this.match.hasPrediction && !!this.match.myPrediction;
  }

  ngOnChanges(): void {
    this.errorMessage = null;

    if (this.match.myPrediction) {
      this.form.setValue({
        homeGoals: this.match.myPrediction.homeGoals,
        awayGoals: this.match.myPrediction.awayGoals
      });
    } else {
      this.form.reset({ homeGoals: 0, awayGoals: 0 });
    }
  }

  submit(): void {
    if (!this.canPredict || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    const { homeGoals, awayGoals } = this.form.getRawValue();
    const request$ = this.isEditMode
      ? this.predictionService.update(this.match.myPrediction!.id, {
          homeGoals,
          awayGoals
        })
      : this.predictionService.create({
          matchId: this.match.id,
          homeGoals,
          awayGoals
        });

    request$.pipe(finalize(() => (this.submitting = false))).subscribe({
      next: () => this.saved.emit(),
      error: (error) => {
        this.errorMessage = getHttpErrorMessage(
          error,
          'No fue posible guardar la predicción.'
        );
      }
    });
  }
}
