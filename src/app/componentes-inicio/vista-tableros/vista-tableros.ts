import { Component, inject, signal, computed, HostListener, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BoardService } from '../../core/services/board.service';
import { ListService } from '../../core/services/list.service';
import { CardService } from '../../core/services/card.service';
import { ReminderService } from '../../core/services/reminder.service';
import { NotificationService } from '../../core/services/notification.service';
import { ModalCrearTablero } from '../modal-crear-tablero/modal-crear-tablero';

@Component({
  selector: 'app-vista-tableros',
  standalone: true,
  imports: [CommonModule, ModalCrearTablero],
  templateUrl: './vista-tableros.html',
  styleUrl: './vista-tableros.css'
})
export class VistaTablerosComponent {
  private router = inject(Router);
  protected boardService = inject(BoardService);
  private listService = inject(ListService);
  private cardService = inject(CardService);
  private reminderService = inject(ReminderService);
  private notificationService = inject(NotificationService);

  totalDueCount = signal(0);

  showCreateBoard = signal(false);
  activeMenuBoardId = signal<number | null>(null);

  // Signals para estadísticas centralizadas y filtro
  boards = computed(() => {
    const term = this.boardService.boardSearchQuery().trim().toLowerCase();
    const all = this.boardService.boards();
    if (!term) return all;
    return all.filter(b => b.nombre.toLowerCase().includes(term));
  });
  totalBoards = computed(() => this.boards().length);
  totalLists = computed(() => this.boards().reduce((s, b) => s + (b.total_columnas || 0), 0));
  totalCards = computed(() => this.boards().reduce((s, b) => s + (b.total_tarjetas || 0), 0));

  // Pagination
  currentPage = signal(1);
  itemsPerPage = signal(11); // 11 boards + 1 "Nuevo tablero" create button = 12 items on grid
  
  totalPages = computed(() => Math.ceil(this.boards().length / this.itemsPerPage()));

  paginatedBoards = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.boards().slice(start, end);
  });

  // Placeholder para tareas por vencer
  totalDue = computed(() => this.totalDueCount());

  constructor() {
    this.reminderService.getPendingReminders().subscribe(res => {
      if (res.success) this.totalDueCount.set(res.data.reminders?.length || 0);
    });

    // Automatically reset pagination to page 1 when the user performs a new search
    effect(() => {
      this.boardService.boardSearchQuery(); // track
      untracked(() => {
        this.currentPage.set(1);
      });
    });
  }

  @HostListener('document:click')
  closeMenus() {
    this.activeMenuBoardId.set(null);
  }

  toggleMenu(boardId: number, event: Event) {
    event.stopPropagation();
    if (this.activeMenuBoardId() === boardId) {
      this.activeMenuBoardId.set(null);
    } else {
      this.activeMenuBoardId.set(boardId);
    }
  }

  async renameBoard(board: any, event: Event) {
    event.stopPropagation();
    this.activeMenuBoardId.set(null);
    const newName = await this.notificationService.prompt('Nuevo nombre del tablero:', board.nombre);
    if (newName && newName.trim() !== '' && newName !== board.nombre) {
      this.boardService.updateBoard(board.id, { nombre: newName.trim() }).subscribe(res => {
        if (res.success) {
          this.notificationService.notify('Tablero renombrado correctamente', 'success');
        }
      });
    }
  }

  async deleteBoard(board: any, event: Event) {
    event.stopPropagation();
    this.activeMenuBoardId.set(null);

    // Optimistically remove board from signal for instant UI feedback
    const originalBoards = this.boardService.boards();
    this.boardService.boards.update(bs => bs.filter(b => b.id !== board.id));

    let undone = false;

    // Show countdown toast with "Undo" button
    const { default: Swal } = await import('sweetalert2');
    Swal.fire({
      html: `<b>${board.nombre}</b> eliminado — <a href="#" id="undo-link" style="color:#3b82f6;font-weight:600;text-decoration:none;">Deshacer</a>`,
      icon: 'info',
      timer: 5000,
      timerProgressBar: true,
      toast: true,
      position: 'bottom-right',
      showConfirmButton: false,
      showCloseButton: true,
      didOpen: () => {
        document.getElementById('undo-link')?.addEventListener('click', (e) => {
          e.preventDefault();
          undone = true;
          // Restore board
          this.boardService.boards.set(originalBoards);
          Swal.close();
          this.notificationService.notify('Eliminación cancelada', 'info');
        });
      }
    }).then((result) => {
      if (!undone) {
        // Timer expired without undo - perform actual deletion
        this.boardService.deleteBoard(board.id).subscribe();
      }
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  openBoard(id: number) {
    this.router.navigate(['/board', id]);
  }

  isImage(p: string | null | undefined): boolean {
    return !!p?.startsWith('url');
  }

  onBoardCreated(newBoard: any) {
    this.showCreateBoard.set(false);
  }
}
