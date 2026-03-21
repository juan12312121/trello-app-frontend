import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * Functional Guard to restrict access to administrative routes.
 * Checks if the current user has the 'admin' role.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notifService = inject(NotificationService);

  const user = authService.currentUser();
  
  if (user && user.rol === 'admin') {
    return true;
  }

  // Not authorized: redirect to dashboard and notify
  notifService.notify('Acceso denegado: Se requieren permisos de administrador.', 'error');
  router.navigate(['/dashboard']);
  return false;
};
