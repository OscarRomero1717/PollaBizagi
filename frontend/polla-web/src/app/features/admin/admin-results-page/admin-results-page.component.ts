import { Component, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { MatchListItem } from '../../../core/models/match.models';
import { MatchService } from '../../../core/services/match.service';
import { getHttpErrorMessage } from '../../../core/utils/http-error.util';
import { AdminMatchListComponent } from '../admin-match-list/admin-match-list.component';

@Component({
  selector: 'app-admin-results-page',
  standalone: true,
  imports: [AdminMatchListComponent],
  templateUrl: './admin-results-page.component.html',
  styleUrl: './admin-results-page.component.scss'
})
export class AdminResultsPageComponent implements OnInit {
  private readonly matchService = inject(MatchService);

  matches: MatchListItem[] = [];
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.loading = true;
    this.errorMessage = null;

    this.matchService
      .getMatches()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.matches = response.matches;
        },
        error: (error) => {
          this.errorMessage = getHttpErrorMessage(
            error,
            'No fue posible cargar los partidos.'
          );
        }
      });
  }

  onResultSaved(message: string): void {
    this.successMessage = message;
    this.loadMatches();
  }
}
