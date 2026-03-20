import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { BoardService } from '../../core/services/board.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-aside-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './aside-inicio.html',
  styleUrl: './aside-inicio.css',
})
export class AsideInicio {
  public router = inject(Router);
  public authService = inject(AuthService);
  public boardService = inject(BoardService);
  private notifService = inject(NotificationService);

  openProfile = output<void>();
  viewChanged = output<'boards' | 'tasks' | 'reminders' | 'activity' | 'analytics'>();

  activeItem = signal<'boards' | 'tasks' | 'reminders' | 'activity' | 'analytics'>('boards');


  goToDashboard() {
    this.activeItem.set('boards');
    this.viewChanged.emit('boards');
    this.router.navigate(['/dashboard']);
  }

  showTasks() {
    this.activeItem.set('tasks');
    this.viewChanged.emit('tasks');
  }

  showReminders() {
    this.activeItem.set('reminders');
    this.viewChanged.emit('reminders');
  }

  showActivity() {
    this.activeItem.set('activity');
    this.viewChanged.emit('activity');
  }

  showAnalytics() {
    this.activeItem.set('analytics');
    this.viewChanged.emit('analytics');
  }

  async handleLogout() {
    const confirm = await this.notifService.confirm('¿Cerrar sesión?', 'Tu sesión actual se cerrará.');
    if (confirm) {
      this.authService.logout();
    }
  }
}
