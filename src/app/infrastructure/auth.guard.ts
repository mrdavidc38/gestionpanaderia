import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../application/auth.service';
import { UserRole } from '../domain/models';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRoles = route.data?.['roles'] as UserRole[];
  if (requiredRoles && !authService.hasRole(requiredRoles)) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
