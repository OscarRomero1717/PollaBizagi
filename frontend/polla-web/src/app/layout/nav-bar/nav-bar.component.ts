import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  path: string;
  exact?: boolean;
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  readonly authService = inject(AuthService);

  readonly mainLinks: NavItem[] = [
    { label: 'Partidos', path: '/matches', exact: true },
    { label: 'Mis predicciones', path: '/my-predictions' },
    { label: 'Leaderboard', path: '/leaderboard' }
  ];

  readonly adminLink: NavItem = { label: 'Admin', path: '/admin' };

  logout(): void {
    this.authService.logout();
  }
}
