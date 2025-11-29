import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const loginAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (!token) {
    return true;
  }

  if (authService.isTokenExpired(token)) {
    authService.logout();
    return true;
  }

  return router.createUrlTree(['/home']);
};
