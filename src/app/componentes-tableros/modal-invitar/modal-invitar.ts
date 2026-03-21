import { Component, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';

export type Rol = 'admin'|'editor'|'comentador'|'viewer';
export interface InvitePayload { email: string; rol: Rol; }

import { BaseModalComponent } from '../../core/classes/base-modal.component';

@Component({
  selector: 'app-modal-invitar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-invitar.html',
  styleUrl: './modal-invitar.css',
})
export class ModalInvitarComponent extends BaseModalComponent {
  private notifService = inject(NotificationService);

  memberInvited = output<InvitePayload>();

  email       = signal('');
  selectedRol = signal<Rol>('editor');

  confirm() {
    const e = this.email().trim();
    if (!e) {
      this.notifService.notify('Ingresa un correo electrónico', 'error');
      return;
    }

    // Validación básica de email
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(e)) {
      this.notifService.notify('Correo electrónico inválido', 'error');
      return;
    }

    this.memberInvited.emit({ email: e, rol: this.selectedRol() });
  }
}
