import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Lista, Tarjeta, Tag, User } from '../../core/models';

@Component({
  selector: 'app-columna-lista',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './columna-lista.html',
  styleUrl: './columna-lista.css',
})
export class ColumnaListaComponent {
  list      = input.required<Lista>();
  tags      = input.required<Tag[]>();
  members   = input.required<any[]>(); // Dejamos como any para flexibilidad con tipos del board
  today     = input<string>('');
  inlineCardAdded = output<{ listId: number; titulo: string }>();

  cardClicked     = output<number>();
  openCreateCard  = output<number>();
  ctxMenu         = output<{ event: MouseEvent; listId: number }>();
  listRenamed     = output<{ listId: number; nombre: string }>();

  cardDropped = output<{ event: CdkDragDrop<Tarjeta[]>, listId: number }>();

  inlineVisible = signal(false);
  inlineText    = signal('');

  showInline()  { this.inlineVisible.set(true); }
  hideInline()  { this.inlineVisible.set(false); this.inlineText.set(''); }

  confirmInline() {
    const t = this.inlineText().trim();
    if (!t) return;
    this.inlineCardAdded.emit({ listId: this.list().id, titulo: t });
    this.hideInline();
  }

  inlineKey(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.confirmInline(); }
    if (e.key === 'Escape') this.hideInline();
  }

  getMember(id: number | null) {
    return this.members().find(m => m.id === id) ?? null;
  }

  getTag(id: number) {
    return this.tags().find(t => t.id === id) ?? null;
  }

  fmtDate(d: any): string {
    if (!d) return '—';
    try {
      const date = new Date(d);
      if (typeof d === 'string' && d.length === 10 && d.includes('-')) {
        date.setHours(12, 0, 0, 0);
      }
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return '—';
    }
  }

  dueClass(d: string | null): string {
    const t = this.today();
    if (!d || !t) return '';
    if (d < t) return 'over';
    if (d === t) return 'today';
    return '';
  }

  canEdit = input<boolean>(true);

  checklistStats(card: Tarjeta) {
    if (!card.checklist) return null;
    const items = card.checklist.items ?? [];
    const tot  = items.length;
    const done = items.filter(i => i.completado).length;
    return { tot, done, complete: done === tot };
  }

  onCdkDrop(event: CdkDragDrop<Tarjeta[]> | any) {
    if (!this.canEdit()) return;
    this.cardDropped.emit({ event, listId: this.list().id });
  }
}
