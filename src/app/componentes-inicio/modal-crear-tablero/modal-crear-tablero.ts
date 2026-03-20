import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { BoardService } from '../../core/services/board.service';
import { AuthService } from '../../core/services/auth.service';
import { ListService } from '../../core/services/list.service';

@Component({
  selector: 'app-modal-crear-tablero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-crear-tablero.html',
  styleUrl: './modal-crear-tablero.css'
})
export class ModalCrearTablero {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<any>();

  private boardService = inject(BoardService);
  private authService = inject(AuthService);
  private listService = inject(ListService);

  nombre: string = '';
  descripcion: string = '';
  portada: string = 'c-blue';

  selectedTemplateId: string = 'blank';
  isGeneratingColumns: boolean = false;

  templates = [
    { id: 'blank', icon: 'M4 6h16M4 12h16M4 18h16', name: 'En Blanco', columns: [] },
    { id: 'scrum', icon: 'M13 10V3L4 14h7v7l9-11h-7z', name: 'Scrum Mágico', columns: ['Backlog', 'Sprint Actual', 'En Progreso', 'En Revisión', 'Terminado'] },
    { id: 'sales', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', name: 'CRM / Ventas', columns: ['Prospectos', 'En Contacto', 'Propuesta Enviada', 'Ganado', 'Perdido'] },
    { id: 'basic', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', name: 'To-Do Clásico', columns: ['Pendientes', 'Haciendo', 'Listo'] }
  ];

  colors = ['c-blue', 'c-purple', 'c-green', 'c-amber', 'c-red', 'c-pink', 'c-teal', 'c-indigo'];
  images = [
    'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=80)',
    'url(https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1920&q=80)',
    'url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80)',
    'url(https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80)',
    'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80)',
    'url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80)'
  ];

  isImage(p: string) { return p.startsWith('url'); }

  async crear() {
    if (!this.nombre.trim() || this.isGeneratingColumns) return;
    this.isGeneratingColumns = true;

    try {
      const user = this.authService.currentUser();
      const res = await firstValueFrom(this.boardService.createBoard({
        nombre: this.nombre,
        descripcion: this.descripcion,
        portada: this.portada,
        usuario_propietario_id: user?.id
      }));

      // Si se crea correctamente y hay plantilla con columnas
      if (res.success && res.data?.id) {
        const tpl = this.templates.find(t => t.id === this.selectedTemplateId);
        if (tpl && tpl.columns.length > 0) {
          // Creación secuencial usando firstValueFrom
          for (let i = 0; i < tpl.columns.length; i++) {
            await firstValueFrom(this.listService.createList(res.data.id, { 
              nombre: tpl.columns[i],
              posicion: i 
            }));
          }
        }
        
        this.created.emit(res.data);
        this.close.emit();
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.isGeneratingColumns = false;
    }
  }
}
