import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  if (!isPlatformBrowser(platformId)) return true; // Permitir el paso en el servidor para evitar redirecciones infinitas/fallos
  
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  // Si no hay token, redirige al login
  router.navigate(['/login']);
  return false;
};
