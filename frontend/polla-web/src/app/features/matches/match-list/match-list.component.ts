import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  MatchListItem,
  MatchStatus,
  MatchStatusLabels
} from '../../../core/models/match.models';
import { PredictionFormComponent } from '../prediction-form/prediction-form.component';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [DatePipe, PredictionFormComponent],
  templateUrl: './match-list.component.html',
  styleUrl: './match-list.component.scss'
})
export class MatchListComponent {
  @Input({ required: true }) matches: MatchListItem[] = [];
  @Output() readonly predictionSaved = new EventEmitter<void>();

  readonly MatchStatus = MatchStatus;

  statusLabel(status: MatchStatus): string {
    return MatchStatusLabels[status] ?? 'Desconocido';
  }

  statusClass(status: MatchStatus): string {
    switch (status) {
      case MatchStatus.Open:
        return 'status-open';
      case MatchStatus.Closed:
        return 'status-closed';
      case MatchStatus.Scored:
        return 'status-scored';
      default:
        return '';
    }
  }
}
