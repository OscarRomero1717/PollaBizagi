import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  MatchListItem,
  MatchStatus,
  MatchStatusLabels
} from '../../../core/models/match.models';
import { OfficialResultFormComponent } from '../official-result-form/official-result-form.component';

@Component({
  selector: 'app-admin-match-list',
  standalone: true,
  imports: [DatePipe, OfficialResultFormComponent],
  templateUrl: './admin-match-list.component.html',
  styleUrl: './admin-match-list.component.scss'
})
export class AdminMatchListComponent {
  @Input({ required: true }) matches: MatchListItem[] = [];
  @Output() readonly resultSaved = new EventEmitter<string>();

  readonly MatchStatus = MatchStatus;

  statusLabel(status: MatchStatus): string {
    return MatchStatusLabels[status] ?? 'Desconocido';
  }
}
