import { Component, OnInit, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

// UI Components
import { AsideInicio } from '../../componentes-inicio/aside-inicio/aside-inicio';
import { HeaderInicio } from '../../componentes-inicio/header-inicio/header-inicio';
import { VistaTablerosComponent } from '../../componentes-inicio/vista-tableros/vista-tableros';
import { Pendientes } from '../../componentes-inicio/pendientes/pendientes';
import { ActividadReciente } from '../../componentes-inicio/actividad-reciente/actividad-reciente';
import { InvitacionesPendientes } from '../../componentes-inicio/invitaciones-pendientes/invitaciones-pendientes';
import { ModalPerfilComponent } from '../../componentes-tableros/modal-perfil/modal-perfil';
import { ListaTareasAsignadas } from '../../componentes-inicio/lista-tareas-asignadas/lista-tareas-asignadas';
import { AnaliticasComponent } from '../../componentes-inicio/analiticas/analiticas';
import { ModalCrearTablero } from '../../componentes-inicio/modal-crear-tablero/modal-crear-tablero';

// Services
import { BoardService } from '../../core/services/board.service';
import { InvitationService } from '../../core/services/invitation.service';
import { ReminderService } from '../../core/services/reminder.service';
import { ActivityService } from '../../core/services/activity.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule, 
    AsideInicio, 
    HeaderInicio, 
    VistaTablerosComponent,
    Pendientes, 
    ActividadReciente, 
    InvitacionesPendientes,
    ModalPerfilComponent,
    ListaTareasAsignadas,
    AnaliticasComponent,
    ModalCrearTablero
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  private boardService = inject(BoardService);
  private inviteService = inject(InvitationService);
  private reminderService = inject(ReminderService);
  private activityService = inject(ActivityService);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);

  // Signals
  boards = signal<any[]>([]);
  invitations = signal<any[]>([]);
  pendientes = signal<any[]>([]);
  activities = signal<any[]>([]);
  currentUser = this.authService.currentUser;
  showProfileModal = signal(false);
  showCreateBoard = signal(false);
  activeView = signal<'boards' | 'tasks' | 'reminders' | 'activity' | 'analytics'>('boards');
  isSidebarOpen = signal(false);

  loading = signal(true);

  @HostListener('window:keydown', ['$event'])
  handleGlobalKeydown(e: KeyboardEvent) {
    // Ignore shortcuts when user is typing in an input, textarea, or contenteditable
    const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
    const isEditing = tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable;

    if (e.key === 'Escape') {
      this.showCreateBoard.set(false);
      this.showProfileModal.set(false);
      return;
    }

    if (isEditing) return;

    switch (e.key.toLowerCase()) {
      case 'c':
        e.preventDefault();
        this.showCreateBoard.set(true);
        break;
      case '/':
        e.preventDefault();
        (document.querySelector('.search-bar input') as HTMLInputElement)?.focus();
        break;
      case 't':
        e.preventDefault();
        this.themeService.toggleTheme();
        break;
    }
  }

  ngOnInit() {
     this.refreshData();
  }

  refreshData() {
    this.loading.set(true);
    
    // Fetch tableros
    this.boardService.getBoards().subscribe(res => {
      if (res.success) this.boards.set(res.data);
    });

    // Fetch invitaciones
    this.inviteService.getMyPendingInvitations().subscribe((res: any) => {
      if (res.success) this.invitations.set(res.data);
    });

    // Fetch pendientes (reminders)
    this.reminderService.getPendingReminders().subscribe(res => {
      if (res.success) this.pendientes.set(res.data.reminders || []);
    });

    // Fetch actividad
    this.activityService.getUserActivity().subscribe((res: any) => {
      if (res.success) this.activities.set(res.data || []);
      this.loading.set(false);
    });
  }

  onCreateBoard() {
    // Implementar si hay un modal global de creación
  }
}
