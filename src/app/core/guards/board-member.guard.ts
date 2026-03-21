import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { BoardService } from '../services/board.service';
import { AuthService } from '../services/auth.service';
import { map, of, catchError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

/**
 * Functional Guard to ensure the user is actually a member of the requested board.
 * Prevents unauthorized board access via direct URL manipulation.
 */
export const boardMemberGuard: CanActivateFn = (route, state) => {
  const token = route.paramMap.get('token');
  const boardService = inject(BoardService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const notifService = inject(NotificationService);

  if (!token) return of(true);

  return boardService.getBoardById(token).pipe(
    map(res => {
      const user = authService.currentUser();
      if (!user) return false;

      // Ensure user is in the board's member list or is the owner
      const isMember = res.data.usuario_propietario_id === user.id ||
                       res.data.miembros?.some((m: any) => m.id === user.id);
      
      if (isMember) return true;

      notifService.notify('No tienes acceso a este tablero.', 'error');
      router.navigate(['/dashboard']);
      return false;
    }),
    catchError(() => {
      notifService.notify('No se pudo verificar el acceso al tablero.', 'error');
      router.navigate(['/dashboard']);
      return of(false);
    })
  );
};
