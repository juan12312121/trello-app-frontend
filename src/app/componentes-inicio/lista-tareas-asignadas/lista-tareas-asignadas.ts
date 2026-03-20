import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardService } from '../../core/services/card.service';

@Component({
  selector: 'app-lista-tareas-asignadas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tasks-view">
      <div class="header">
        <h1>Mis Tareas Asignadas</h1>
        <p>Listado de todas las tarjetas donde eres el responsable activo.</p>
      </div>

      <div class="tasks-container">
        @if (loading()) {
          <div class="loading">Cargando tareas...</div>
        } @else if (tasks().length === 0) {
          <div class="empty">
            <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <p>¡Todo al día! No tienes tareas asignadas pendientes.</p>
          </div>
        } @else {
          <div class="tasks-table">
            <div class="table-header">
              <span class="col-title">Tarea</span>
              <span class="col-board">Tablero</span>
              <span class="col-list">Lista</span>
              <span class="col-due">Vencimiento</span>
              <span class="col-priority">Prioridad</span>
            </div>
            
            @for (t of tasks(); track t.id) {
              <div class="task-item" (click)="openCard(t)">
                <div class="col-title">
                  <div class="check" [class.done]="t.completada"></div>
                  <span class="title-txt">{{ t.titulo }}</span>
                </div>
                <div class="col-board">
                  <span class="badge board-badge">{{ t.board_nombre }}</span>
                </div>
                <div class="col-list">
                  <span class="badge list-badge">{{ t.lista_nombre }}</span>
                </div>
                <div class="col-due" [class.overdue]="isOverdue(t.fecha_vencimiento)">
                  {{ t.fecha_vencimiento ? (t.fecha_vencimiento | date:'shortDate') : '—' }}
                </div>
                <div class="col-priority">
                  <span class="p-dot" [ngClass]="t.prioridad || 'media'"></span>
                  {{ t.prioridad || 'media' | titlecase }}
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .tasks-view { padding: 40px; }
    .header h1 { font-size: 1.8rem; font-weight: 800; color: var(--t1); margin-bottom: 8px; }
    .header p { color: var(--t3); font-size: 0.95rem; margin-bottom: 32px; }
    
    .tasks-container { background: var(--surface); border-radius: 16px; border: 1px solid var(--bd); min-height: 400px; }
    .loading, .empty { padding: 80px; text-align: center; color: var(--t3); }
    .empty svg { width: 48px; height: 48px; color: var(--green); margin-bottom: 16px; opacity: 0.5; }
    
    .tasks-table { display: flex; flex-direction: column; }
    .table-header { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; padding: 16px 24px; border-bottom: 1px solid var(--bd); font-size: 0.8rem; font-weight: 700; color: var(--t3); text-transform: uppercase; letter-spacing: 0.05em; }
    
    .task-item { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; padding: 14px 24px; border-bottom: 1px solid var(--bd); align-items: center; cursor: pointer; transition: background 0.2s; }
    .task-item:hover { background: var(--s2); }
    .task-item:last-child { border-bottom: none; }
    
    .col-title { display: flex; align-items: center; gap: 12px; }
    .check { width: 14px; height: 14px; border-radius: 4px; border: 2px solid var(--bd); }
    .check.done { background: var(--green); border-color: var(--green); }
    .title-txt { font-size: 0.9rem; font-weight: 600; color: var(--t1); }
    
    .badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
    .board-badge { background: var(--blue-light); color: var(--blue); }
    .list-badge { background: var(--s2); color: var(--t2); }
    
    .col-due { font-size: 0.85rem; color: var(--t2); }
    .col-due.overdue { color: var(--rose); font-weight: 700; }
    
    .col-priority { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: var(--t2); }
    .p-dot { width: 8px; height: 8px; border-radius: 50%; }
    .p-dot.alta { background: var(--rose); }
    .p-dot.media { background: var(--amber); }
    .p-dot.baja { background: var(--green); }
  `]
})
export class ListaTareasAsignadas implements OnInit {
  private cardService = inject(CardService);
  private router = inject(Router);

  tasks = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.cardService.getAssignedCards().subscribe({
      next: (res) => {
        if (res.success) this.tasks.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  isOverdue(date: string | null): boolean {
    if (!date) return false;
    return new Date(date).getTime() < new Date().getTime();
  }

  openCard(task: any) {
    // Para abrir la tarjeta, navegamos al tablero y usamos un query param o simplemente el router
    // Por ahora, solo navegamos al tablero
    this.router.navigate(['/board', task.board_id]);
  }
}
