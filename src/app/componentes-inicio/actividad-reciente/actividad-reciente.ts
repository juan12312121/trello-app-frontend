import { Component, inject, OnInit, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../core/services/board.service';
import { ActivityService } from '../../core/services/activity.service';

@Component({
  selector: 'app-actividad-reciente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actividad-reciente.html',
  styleUrl: './actividad-reciente.css',
})
export class ActividadReciente implements OnInit {
  private boardService = inject(BoardService);
  private activityService = inject(ActivityService);
  
  actividades = signal<any[]>([]);
  seeAll = output<void>();

  // Pagination signals
  currentPage = signal(1);
  itemsPerPage = signal(8
  );

  totalPages = computed(() => Math.ceil(this.actividades().length / this.itemsPerPage()));

  paginatedActividades = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.actividades().slice(start, end);
  });

  ngOnInit() {
    this.activityService.getUserActivity().subscribe((res: any) => {
      if (res.success) {
        this.actividades.set(res.data.activity || res.data || []);
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
