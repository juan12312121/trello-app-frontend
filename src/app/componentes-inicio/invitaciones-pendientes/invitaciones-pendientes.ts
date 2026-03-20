import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InvitationService, Invitacion } from '../../core/services/invitation.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-invitaciones-pendientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invitaciones-pendientes.html',
  styleUrl: './invitaciones-pendientes.css'
})
export class InvitacionesPendientes implements OnInit {
  private invitationService = inject(InvitationService);
  private notifService = inject(NotificationService);
  private router = inject(Router);

  invitations = signal<Invitacion[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadInvitations();
  }

  loadInvitations() {
    this.loading.set(true);
    this.invitationService.getMyPendingInvitations().subscribe({
      next: (res) => {
        if (res.success) {
          this.invitations.set(res.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  accept(id: number) {
    this.invitationService.acceptInvitation(id).subscribe({
      next: (res) => {
        if (res.success && res.data.boardId) {
          this.notifService.notify('Invitación aceptada', 'success');
          // Navegar al tablero que acabamos de aceptar
          this.router.navigate(['/board', res.data.boardId]);
        }
      },
      error: (err) => this.notifService.notify(err.error?.message || 'Error al aceptar invitación', 'error')
    });
  }

  reject(id: number) {
    this.invitationService.rejectInvitation(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.notifService.notify('Invitación rechazada', 'success');
          this.loadInvitations();
        }
      },
      error: (err) => this.notifService.notify(err.error?.message || 'Error al rechazar invitación', 'error')
    });
  }
}
