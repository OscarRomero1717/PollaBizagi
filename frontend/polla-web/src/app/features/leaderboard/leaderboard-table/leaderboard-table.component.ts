import { Component, Input } from '@angular/core';
import { LeaderboardEntry } from '../../../core/models/leaderboard.models';

@Component({
  selector: 'app-leaderboard-table',
  standalone: true,
  templateUrl: './leaderboard-table.component.html',
  styleUrl: './leaderboard-table.component.scss'
})
export class LeaderboardTableComponent {
  @Input({ required: true }) entries: LeaderboardEntry[] = [];
  @Input() highlightName: string | null = null;

  isCurrentUser(entry: LeaderboardEntry): boolean {
    return !!this.highlightName && entry.displayName === this.highlightName;
  }
}
