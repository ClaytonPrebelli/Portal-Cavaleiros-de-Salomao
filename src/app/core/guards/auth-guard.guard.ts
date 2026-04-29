import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const userStr = localStorage.getItem('MasonUser');
  
  if (userStr) {
    return true;
  }
  
  return router.createUrlTree(['/']);
};
