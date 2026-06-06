import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../models/api-error.model';
import { correlationIdHeader } from '../interceptors/correlation.interceptor';

export function getHttpErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  const body = error.error as ApiErrorResponse | string | null;
  let message = fallback;

  if (body && typeof body === 'object' && 'message' in body && body.message) {
    message = body.message;
  } else if (typeof body === 'string' && body.trim()) {
    message = body;
  }

  const correlationId = error.headers.get(correlationIdHeader);
  if (correlationId) {
    return `${message} (Ref: ${correlationId})`;
  }

  return message;
}
