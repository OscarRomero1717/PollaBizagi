import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MyPredictionItem } from '../../../core/models/prediction.models';
import { PredictionService } from '../../../core/services/prediction.service';
import { getHttpErrorMessage } from '../../../core/utils/http-error.util';
import { PredictionHistoryTableComponent } from '../prediction-history-table/prediction-history-table.component';

@Component({
  selector: 'app-my-predictions-page',
  standalone: true,
  imports: [PredictionHistoryTableComponent, RouterLink],
  templateUrl: './my-predictions-page.component.html',
  styleUrl: './my-predictions-page.component.scss'
})
export class MyPredictionsPageComponent implements OnInit {
  private readonly predictionService = inject(PredictionService);

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
    this.loadPredictions();
  }

  loadPredictions(): void {
    this.loading = true;
    this.errorMessage = null;

    this.predictionService
      .getMyPredictions()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.predictions = response.predictions;
        },
        error: (error) => {
          this.errorMessage = getHttpErrorMessage(
            error,
            'No fue posible cargar tus predicciones.'
          );
        }
      });
  }
}
