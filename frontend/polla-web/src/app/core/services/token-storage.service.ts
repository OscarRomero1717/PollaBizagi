import { Injectable } from '@angular/core';
import { AuthSession } from '../models/auth.models';
import { StorageKeys } from '../constants/storage-keys';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  getSession(): AuthSession | null {
    const raw = localStorage.getItem(StorageKeys.AuthSession);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      this.clearSession();
      return null;
    }
  }

  saveSession(session: AuthSession): void {
    localStorage.setItem(StorageKeys.AuthSession, JSON.stringify(session));
  }

  clearSession(): void {
    localStorage.removeItem(StorageKeys.AuthSession);
  }
}
