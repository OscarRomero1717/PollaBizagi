import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../models/api-error.model';

export function getHttpErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  const body = error.error as ApiErrorResponse | string | null;

  if (body && typeof body === 'object' && 'message' in body && body.message) {
    return body.message;
  }

  if (typeof body === 'string' && body.trim()) {
    return body;
  }

  return fallback;
}
