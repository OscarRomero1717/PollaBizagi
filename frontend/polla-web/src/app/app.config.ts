import { ApplicationConfig, APP_INITIALIZER, inject } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { correlationInterceptor } from './core/interceptors/correlation.interceptor';
import { AuthService } from './core/services/auth.service';

function restoreAuthSession(): () => void {
  const authService = inject(AuthService);
  return () => authService.restoreSession();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([correlationInterceptor, authInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: restoreAuthSession,
      multi: true
    }
  ]
};
