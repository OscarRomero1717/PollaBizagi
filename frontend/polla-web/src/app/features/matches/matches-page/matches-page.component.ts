import { Component, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { MatchListItem } from '../../../core/models/match.models';
import { MatchService } from '../../../core/services/match.service';
import { getHttpErrorMessage } from '../../../core/utils/http-error.util';
import { MatchListComponent } from '../match-list/match-list.component';

@Component({
  selector: 'app-matches-page',
  standalone: true,
  imports: [MatchListComponent],
  templateUrl: './matches-page.component.html',
  styleUrl: './matches-page.component.scss'
})
export class MatchesPageComponent implements OnInit {
  private readonly matchService = inject(MatchService);

  matches: MatchListItem[] = [];
  loading = false;
  errorMessage: string | null = null;

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
}
