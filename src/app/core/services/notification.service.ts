import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private subtleToast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: 'var(--surface)',
    color: 'var(--t1)',
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  private subtleConfirm = Swal.mixin({
    background: 'var(--surface)',
    color: 'var(--t1)',
    confirmButtonColor: 'var(--blue)',
    cancelButtonColor: 'var(--s3)',
    buttonsStyling: true,
    customClass: {
      popup: 'swal2-subtle-popup',
      confirmButton: 'swal2-subtle-confirm',
      cancelButton: 'swal2-subtle-cancel'
    }
  });

  constructor() { }

  /**
   * Muestra una notificación tipo toast (sutil)
   */
  notify(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    this.subtleToast.fire({
      icon: type,
      title: message
    });
  }

  /**
   * Muestra un diálogo de confirmación
   */
  async confirm(title: string, text: string = '', confirmText: string = 'Confirmar', cancelText: string = 'Cancelar'): Promise<boolean> {
    const result = await this.subtleConfirm.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true
    });

    return result.isConfirmed;
  }

  /**
   * Muestra una alerta simple
   */
  alert(title: string, message: string = '', type: 'info' | 'success' | 'error' | 'warning' = 'info') {
    this.subtleConfirm.fire({
      title: title,
      text: message,
      icon: type,
      confirmButtonText: 'Entendido'
    });
  }

  /**
   * Muestra un diálogo que pide información de texto al usuario (tipo prompt)
   */
  async prompt(title: string, defaultValue: string = '', confirmText: string = 'Guardar', cancelText: string = 'Cancelar'): Promise<string | null> {
    const result = await this.subtleConfirm.fire({
      title: title,
      input: 'text',
      inputValue: defaultValue,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
      inputValidator: (value) => {
        if (!value || value.trim() === '') {
          return '¡El campo no puede estar vacío!';
        }
        return null; // Return null when valid
      }
    });

    if (result.isConfirmed) {
      return result.value;
    }
    return null;
  }
}
