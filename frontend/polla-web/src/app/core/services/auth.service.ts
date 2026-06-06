import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthSession,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from '../models/auth.models';
import { RoleNames } from '../models/roles';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly sessionState = signal<AuthSession | null>(this.tokenStorage.getSession());

  readonly session = this.sessionState.asReadonly();
  readonly isAuthenticated = computed(() => {
    const session = this.sessionState();
    return !!session && !this.isExpired(session);
  });
  readonly role = computed(() => this.sessionState()?.role ?? null);
  readonly displayName = computed(() => this.sessionState()?.displayName ?? null);
  readonly isAdmin = computed(() => this.role() === RoleNames.Admin);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, request)
      .pipe(tap((response) => this.persistLogin(response)));
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${environment.apiUrl}/api/auth/register`,
      request
    );
  }

  logout(redirectToLogin = true): void {
    this.sessionState.set(null);
    this.tokenStorage.clearSession();

    if (redirectToLogin) {
      void this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    const session = this.sessionState();
    if (!session || this.isExpired(session)) {
      return null;
    }

    return session.token;
  }

  restoreSession(): void {
    const session = this.tokenStorage.getSession();
    if (!session || this.isExpired(session)) {
      this.logout(false);
      return;
    }

    this.sessionState.set(session);
  }

  private persistLogin(response: LoginResponse): void {
    const session: AuthSession = {
      token: response.token,
      expiresAt: response.expiresAt,
      role: response.role,
      displayName: response.displayName
    };

    this.sessionState.set(session);
    this.tokenStorage.saveSession(session);
  }

  private isExpired(session: AuthSession): boolean {
    return new Date(session.expiresAt).getTime() <= Date.now();
  }
}
