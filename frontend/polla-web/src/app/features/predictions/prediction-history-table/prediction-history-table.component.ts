import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MyPredictionItem } from '../../../core/models/prediction.models';

@Component({
  selector: 'app-prediction-history-table',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './prediction-history-table.component.html',
  styleUrl: './prediction-history-table.component.scss'
})
export class PredictionHistoryTableComponent {
  @Input({ required: true }) predictions: MyPredictionItem[] = [];

  hasOfficialResult(item: MyPredictionItem): boolean {
    return (
      item.officialHomeGoals !== null && item.officialAwayGoals !== null
    );
  }

  pointsLabel(item: MyPredictionItem): string {
    return this.hasOfficialResult(item) ? `${item.pointsAwarded}` : '—';
  }
}
