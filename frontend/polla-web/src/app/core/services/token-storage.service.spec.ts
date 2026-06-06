import { StorageKeys } from '../constants/storage-keys';
import { AuthSession } from '../models/auth.models';
import { TokenStorageService } from './token-storage.service';

describe('TokenStorageService', () => {
  let service: TokenStorageService;

  const session: AuthSession = {
    token: 'jwt-token',
    expiresAt: '2099-01-01T00:00:00Z',
    role: 'User',
    displayName: 'Demo'
  };

  beforeEach(() => {
    localStorage.clear();
    service = new TokenStorageService();
  });

  it('should save and read session', () => {
    service.saveSession(session);

    expect(service.getSession()).toEqual(session);
    expect(localStorage.getItem(StorageKeys.AuthSession)).toContain('jwt-token');
  });

  it('should clear session', () => {
    service.saveSession(session);
    service.clearSession();

    expect(service.getSession()).toBeNull();
  });

  it('should return null for invalid json', () => {
    localStorage.setItem(StorageKeys.AuthSession, '{bad-json');

    expect(service.getSession()).toBeNull();
    expect(localStorage.getItem(StorageKeys.AuthSession)).toBeNull();
  });
});
