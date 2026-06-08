import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MyPredictionItem } from '../../../core/models/prediction.models';
import { PredictionService } from '../../../core/services/prediction.service';
import { getHttpErrorMessage } from '../../../core/utils/http-error.util';
import { PredictionHistoryTableComponent } from '../../predictions/prediction-history-table/prediction-history-table.component';

@Component({
  selector: 'app-user-predictions-page',
  standalone: true,
  imports: [PredictionHistoryTableComponent, RouterLink],
  templateUrl: './user-predictions-page.component.html',
  styleUrl: './user-predictions-page.component.scss'
})
export class UserPredictionsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly predictionService = inject(PredictionService);

  displayName: string | null = null;
  predictions: MyPredictionItem[] = [];
  loading = false;
  errorMessage: string | null = null;

  get totalPoints(): number {
    return this.predictions.reduce((sum, item) => {
      if (item.officialHomeGoals === null || item.officialAwayGoals === null) {
        return sum;
      }

      return sum + item.pointsAwarded;
    }, 0);
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');

    if (!userId) {
      this.errorMessage = 'Participante no válido.';
      return;
    }

    this.loadPredictions(userId);
  }

  loadPredictions(userId: string): void {
    this.loading = true;
    this.errorMessage = null;

    this.predictionService
      .getUserPredictions(userId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.displayName = response.displayName;
          this.predictions = response.predictions;
        },
        error: (error) => {
          this.errorMessage = getHttpErrorMessage(
            error,
            'No fue posible cargar el historial del participante.'
          );
        }
      });
  }
}
