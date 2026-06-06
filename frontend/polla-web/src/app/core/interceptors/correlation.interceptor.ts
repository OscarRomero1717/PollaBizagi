import { HttpInterceptorFn } from '@angular/common/http';

export const correlationIdHeader = 'X-Correlation-Id';

export const correlationInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has(correlationIdHeader)) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        [correlationIdHeader]: crypto.randomUUID()
      }
    })
  );
};
