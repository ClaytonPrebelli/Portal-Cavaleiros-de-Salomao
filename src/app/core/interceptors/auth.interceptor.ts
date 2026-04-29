import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Envs } from '../services/envs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  return next(modifiedReq);
};
