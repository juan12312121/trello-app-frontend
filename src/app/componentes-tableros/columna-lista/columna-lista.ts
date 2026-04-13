import { Component, input, output, signal, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  presenceMap = input<Record<number, any[]>>({}, { alias: 'cardViewers' }); // cardId -> list of users viewing it
  inlineCardAdded = output<{ listId: number; titulo: string }>();

  cardClicked     = output<number>();
  openCreateCard  = output<number>();
  ctxMenu         = output<{ event: MouseEvent; listId: number; cardId?: number }>();
  listRenamed     = output<{ listId: number; nombre: string }>();

  cardDropped = output<{ event: CdkDragDrop<Tarjeta[]>, listId: number }>();

  inlineVisible = signal(false);
  inlineText    = signal('');
  
  private platformId = inject(PLATFORM_ID);
  tagsExpanded = signal(false);
  
  private toggleListener = () => {
    this.tagsExpanded.set(localStorage.getItem('trello_tags_ex') === 'true');
  };

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.tagsExpanded.set(localStorage.getItem('trello_tags_ex') === 'true');
      window.addEventListener('trello_tags_toggled', this.toggleListener);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('trello_tags_toggled', this.toggleListener);
    }
  }

  toggleTags(e: Event) {
    e.stopPropagation();
    const isEx = !this.tagsExpanded();
    this.tagsExpanded.set(isEx);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('trello_tags_ex', isEx.toString());
      window.dispatchEvent(new Event('trello_tags_toggled'));
    }
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

  dueClass(d: string | null, completada?: boolean): string {
    if (completada) return 'done';
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
