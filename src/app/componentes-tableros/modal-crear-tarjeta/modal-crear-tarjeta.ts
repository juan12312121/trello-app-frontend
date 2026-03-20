import { Component, input, output, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Lista, Tag } from '../../core/models';
import { NotificationService } from '../../core/services/notification.service';

export interface CreateCardPayload {
  listId: number;
  titulo: string;
  descripcion: string;
  prioridad: 'baja' | 'media' | 'alta';
  fecha_vencimiento: string | null;
  usuario_asignado_id: number | null;
  tags: number[];
}

@Component({
  selector: 'app-modal-crear-tarjeta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-crear-tarjeta.html',
  styleUrl: './modal-crear-tarjeta.css',
})
export class ModalCrearTarjetaComponent implements OnInit {
  lists         = input.required<Lista[]>();
  tags          = input.required<Tag[]>();
  members       = input.required<any[]>();
  defaultListId = input<number | null>(null);

  cardCreated = output<CreateCardPayload>();
  closed      = output<void>();

  private notifService = inject(NotificationService);

  titulo       = signal('');
  descripcion  = signal('');
  prioridad    = signal<'baja' | 'media' | 'alta'>('media');
  due          = signal('');
  assignedId   = signal<number | null>(null);
  listId       = signal<number | null>(null);
  selectedTags = signal<number[]>([]);

  ngOnInit() {
    const def = this.defaultListId() ?? this.lists()[0]?.id ?? null;
    this.listId.set(def);
  }

  toggleTag(id: number) {
    this.selectedTags.update(t =>
      t.includes(id) ? t.filter(x => x !== id) : [...t, id]
    );
  }

  isTagSelected(id: number) { return this.selectedTags().includes(id); }

  confirm() {
    const t = this.titulo().trim();
    if (!t) {
      this.notifService.notify('Ingresa un título para la tarjeta', 'warning');
      return;
    }
    const lid = this.listId() ?? this.lists()[0]?.id;
    if (!lid) return;
    
    this.cardCreated.emit({
      listId: lid,
      titulo: t,
      descripcion: this.descripcion().trim(),
      prioridad: this.prioridad(),
      fecha_vencimiento: this.due() || null,
      usuario_asignado_id: this.assignedId(),
      tags: this.selectedTags(),
    });
  }
}
