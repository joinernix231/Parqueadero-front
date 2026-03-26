import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { TokenStorageService } from '../auth/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const token = tokenStorage.getToken();

  const headers: Record<string, string> = {
    Accept: 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Para requests con body, seteamos Content-Type solo cuando haga falta.
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.headers.has('Content-Type')) {
    headers['Content-Type'] = 'application/json';
  }

  const nextReq = Object.keys(headers).length > 0 ? req.clone({ setHeaders: headers }) : req;
  return next(nextReq);
};

