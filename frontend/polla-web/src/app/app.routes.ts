import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { AdminResultsPageComponent } from './features/admin/admin-results-page/admin-results-page.component';
import { LoginPageComponent } from './features/auth/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/register-page/register-page.component';
import { LeaderboardPageComponent } from './features/leaderboard/leaderboard-page/leaderboard-page.component';
import { MatchesPageComponent } from './features/matches/matches-page/matches-page.component';
import { MyPredictionsPageComponent } from './features/predictions/my-predictions-page/my-predictions-page.component';
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'matches' },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        canActivate: [guestGuard],
        component: LoginPageComponent
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        component: RegisterPageComponent
      }
    ]
  },
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: 'matches',
        canActivate: [authGuard],
        component: MatchesPageComponent
      },
      {
        path: 'my-predictions',
        canActivate: [authGuard],
        component: MyPredictionsPageComponent
      },
      {
        path: 'leaderboard',
        canActivate: [authGuard],
        component: LeaderboardPageComponent
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        component: AdminResultsPageComponent
      }
    ]
  },
  { path: '**', redirectTo: 'matches' }
];
