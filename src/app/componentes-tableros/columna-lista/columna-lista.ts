import { Component, input, output, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Lista, Tarjeta, Tag, User } from '../../core/models';
import { fmtDate } from '../../core/utils/functions';

@Component({
  selector: 'app-columna-lista',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './columna-lista.html',
  styleUrl: './columna-lista.css',
})
export class ColumnaListaComponent implements OnDestroy {
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

  tagsExpanded = signal(localStorage.getItem('trello_tags_ex') === 'true');
  
  private toggleListener = () => {
    this.tagsExpanded.set(localStorage.getItem('trello_tags_ex') === 'true');
  };

  constructor() {
    window.addEventListener('trello_tags_toggled', this.toggleListener);
  }

  ngOnDestroy() {
    window.removeEventListener('trello_tags_toggled', this.toggleListener);
  }

  toggleTags(e: Event) {
    e.stopPropagation();
    const isEx = !this.tagsExpanded();
    this.tagsExpanded.set(isEx);
    localStorage.setItem('trello_tags_ex', isEx.toString());
    window.dispatchEvent(new Event('trello_tags_toggled'));
  }

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

  public fmtDate = fmtDate;

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
