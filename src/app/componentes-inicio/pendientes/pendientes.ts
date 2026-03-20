import { Component, inject, OnInit, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../core/services/board.service';
import { ListService } from '../../core/services/list.service';
import { CardService } from '../../core/services/card.service';
import { AuthService } from '../../core/services/auth.service';
import { ReminderService } from '../../core/services/reminder.service';

@Component({
  selector: 'app-pendientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pendientes.html',
  styleUrl: './pendientes.css',
})
export class Pendientes implements OnInit {
  private boardService = inject(BoardService);
  private listService = inject(ListService);
  private cardService = inject(CardService);
  private authService = inject(AuthService);
  private reminderService = inject(ReminderService);
  
  tareas = signal<any[]>([]);
  seeAll = output<void>();

  // Pagination signals
  currentPage = signal(1);
  itemsPerPage = signal(8);

  totalPages = computed(() => Math.ceil(this.tareas().length / this.itemsPerPage()));

  paginatedTareas = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.tareas().slice(start, end);
  });

  ngOnInit() {
    this.reminderService.getPendingReminders().subscribe(res => {
      if (res.success) {
        this.tareas.set(res.data.reminders || []);
        this.currentPage.set(1);
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
}
