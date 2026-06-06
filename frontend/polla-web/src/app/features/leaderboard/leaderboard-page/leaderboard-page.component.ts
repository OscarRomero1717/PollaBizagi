import { Component, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LeaderboardEntry } from '../../../core/models/leaderboard.models';
import { AuthService } from '../../../core/services/auth.service';
import { LeaderboardService } from '../../../core/services/leaderboard.service';
import { getHttpErrorMessage } from '../../../core/utils/http-error.util';
import { LeaderboardTableComponent } from '../leaderboard-table/leaderboard-table.component';

@Component({
  selector: 'app-leaderboard-page',
  standalone: true,
  imports: [LeaderboardTableComponent],
  templateUrl: './leaderboard-page.component.html',
  styleUrl: './leaderboard-page.component.scss'
})
export class LeaderboardPageComponent implements OnInit {
  private readonly leaderboardService = inject(LeaderboardService);
  private readonly authService = inject(AuthService);

  entries: LeaderboardEntry[] = [];
  loading = false;
  errorMessage: string | null = null;

  readonly currentDisplayName = this.authService.displayName;

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(): void {
    this.loading = true;
    this.errorMessage = null;

    this.leaderboardService
      .getLeaderboard()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.entries = response.entries;
        },
        error: (error) => {
          this.errorMessage = getHttpErrorMessage(
            error,
            'No fue posible cargar el leaderboard.'
          );
        }
      });
  }
}
