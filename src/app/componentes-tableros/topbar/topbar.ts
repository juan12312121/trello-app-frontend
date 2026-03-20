import { Component, input, output, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Board } from '../../core/models';
import { ReminderService } from '../../core/services/reminder.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class TopbarComponent {
  board = input.required<Board>();
  canEdit = input<boolean>(true);
  isAdmin = input<boolean>(true);

  openInvite     = output<void>();
  openCreateCard = output<void>();
  openSettings   = output<void>();
  boardRenamed   = output<string>();

  private router = inject(Router);
  private reminderService = inject(ReminderService);
  private authService = inject(AuthService);
  public themeService = inject(ThemeService);

  pendingReminders = signal<any[]>([]);
  showNotifs = signal(false);
  showThemeMenu = signal(false);

  ngOnInit() {
    this.loadReminders();
    // Poll cada minuto
    setInterval(() => this.loadReminders(), 60000);
  }

  loadReminders() {
    const user = this.authService.currentUser();
    if (!user) return;
    this.reminderService.getPendingReminders().subscribe(res => {
      this.pendingReminders.set(res.data?.reminders || []);
    });
  }

  dismissReminder(rem: any, event: Event) {
    event.stopPropagation();
    this.reminderService.deleteReminder(rem.board_id, rem.list_id, rem.card_id, rem.id).subscribe(() => {
      this.loadReminders();
    });
  }

  toggleNotifs() { this.showNotifs.set(!this.showNotifs()); }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
