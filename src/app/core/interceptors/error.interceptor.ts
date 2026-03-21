import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 1. Log detallado para consola del frontend (solo para debug)
      console.error(
        '%c[ERROR HTTP DETECTADO EN EL CLIENTE]', 
        'color: red; font-size: 14px; font-weight: bold;',
        `\n=> RUTA: ${req.url}`,
        `\n=> MÉTODO: ${req.method}`,
        `\n=> ESTADO: ${error.status} ${error.statusText}`,
        `\n=> DETALLES DEL SERVIDOR:`, error.error ?? error.message
      );

      // 2. Extraer el mensaje para el usuario
      let userMessage = 'Ocurrió un error inesperado al procesar la solicitud. Por favor contacta a soporte.';
      let userTitle = 'Oops...';

      if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente / red
          userMessage = `Error de red: ${error.error.message}`;
      } else {
          // Error devuelto desde el Backend
          if (error.status === 0) {
              userMessage = 'No se pudo conectar al servidor. El API podría estar caída o tienes un problema de conexión a internet.';
              userTitle = 'Sin conexión';
          } else if (error.status === 400) {
              userMessage = error.error?.message || 'Los datos enviados son inválidos. Por favor, revisa tus campos.';
              userTitle = 'Solicitud Incorrecta';
          } else if (error.status === 401) {
              userMessage = error.error?.message || 'Tu sesión ha expirado o no tienes permisos. Por favor, inicia sesión de nuevo.';
              userTitle = 'No Autorizado';
              // Aquí en el futuro puedes hacer un logout forzado
              if (req.url.indexOf('/login') === -1) {
                   localStorage.removeItem('token');
                   // Opcional: inyectar el router y redireccionar
              }
          } else if (error.status === 403) {
              userMessage = error.error?.message || 'No tienes permisos suficientes para realizar esta acción.';
              userTitle = 'Acceso Denegado';
          } else if (error.status === 404) {
              userMessage = error.error?.message || 'No se encontró el recurso solicitado.';
              userTitle = 'No Encontrado';
          } else if (error.status === 409) {
              userMessage = error.error?.message || 'Conflicto de datos repetidos o incompatibles.';
              userTitle = 'Conflicto';
          } else if (error.status === 429) {
              userMessage = error.error?.message || 'Has superado el límite de intentos. Por favor, intenta de nuevo más tarde.';
              userTitle = 'Demasiados Intentos';
          } else if (error.status >= 500) {
              userMessage = error.error?.message || 'El servidor experimentó un error interno y no pudo completar la solicitud.';
              userTitle = 'Error de Servidor';
          }
      }

      // 3. Mostrar la alerta SweetAlert2 de manera amigable
      Swal.fire({
          icon: 'error',
          title: userTitle,
          text: userMessage,
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#3f51b5'
      });

      // Retornar el observable arrojando nuevamente el error
      return throwError(() => error);
    })
  );
};
