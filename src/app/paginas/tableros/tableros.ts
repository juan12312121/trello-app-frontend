import { Component, inject, OnInit, OnDestroy, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router, ActivatedRoute } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { ActivityService } from '../../core/services/activity.service';

import { BoardService } from '../../core/services/board.service';
import { AuthService } from '../../core/services/auth.service';
import { Board, Lista, Tarjeta, Tag, User } from '../../core/models';
import { ListService } from '../../core/services/list.service';
import { CardService } from '../../core/services/card.service';
import { ChecklistService } from '../../core/services/checklist.service';
import { CommentService } from '../../core/services/comment.service';
import { ReminderService } from '../../core/services/reminder.service';
import { InvitationService } from '../../core/services/invitation.service';
import { TagService } from '../../core/services/tag.service';
import { NotificationService } from '../../core/services/notification.service';

import { SidebarComponent } from '../../componentes-tableros/sidebar/sidebar';
import { TopbarComponent } from '../../componentes-tableros/topbar/topbar';
import { ColumnaListaComponent } from '../../componentes-tableros/columna-lista/columna-lista';
import { AgregarListaComponent } from '../../componentes-tableros/agregar-lista/agregar-lista';
import { ContextMenu } from '../../componentes-tableros/context-menu/context-menu';
import { ModalInvitarComponent } from '../../componentes-tableros/modal-invitar/modal-invitar';
import { ModalCrearTarjetaComponent } from '../../componentes-tableros/modal-crear-tarjeta/modal-crear-tarjeta';
import { 
  ModalDetalleTarjetaComponent, 
  CardUpdatedPayload, 
  ChecklistTogglePayload, 
  ChecklistAddPayload, 
  CommentAddPayload, 
  ReminderAddPayload 
} from '../../componentes-tableros/modal-detalle-tarjeta/modal-detalle-tarjeta';
import { ModalAjustesTableroComponent } from '../../componentes-tableros/modal-ajustes-tablero/modal-ajustes-tablero';
import { ModalPerfilComponent } from '../../componentes-tableros/modal-perfil/modal-perfil';
import { BoardChatComponent } from '../../componentes-tableros/board-chat/board-chat';

@Component({
  selector: 'app-tableros',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    TopbarComponent,
    ColumnaListaComponent,
    AgregarListaComponent,
    ContextMenu,
    ModalInvitarComponent,
    ModalCrearTarjetaComponent,
    ModalDetalleTarjetaComponent,
    ModalAjustesTableroComponent,
    ModalPerfilComponent,
    BoardChatComponent,
    DragDropModule
  ],
  templateUrl: './tableros.html',
  styleUrl: './tableros.css',
})
export class TablerosComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  private listService = inject(ListService);
  private cardService = inject(CardService);
  private checklistService = inject(ChecklistService);
  private commentService = inject(CommentService);
  private reminderService = inject(ReminderService);
  private activityService = inject(ActivityService);
  private authService = inject(AuthService);
  private invitationService = inject(InvitationService);
  private tagService = inject(TagService);
  private router = inject(Router);
  private notifService = inject(NotificationService);

  // ── Signals de Estado ──────────────────────────────────────────────
  board = signal<any>(null);
  lists = signal<Lista[]>([]);
  activeCardId = signal<number | null>(null);
  
  // UI Selection
  viewMode = signal<'kanban' | 'list' | 'calendar'>('kanban');
  filterBy = signal<string | null>(null); // 'overdue', 'my-tasks', 'archived', 'attachments', 'tag-X'
  
  // Calendar State
  calendarDate = signal(new Date());

  // Auxiliares
  allUsers = signal<any[]>([]);
  tags = signal<Tag[]>([]);
  activity = signal<any[]>([]);
  otherBoards = signal<any[]>([]);
  readonly today = new Date().toISOString().split('T')[0];

  // ── Signals UI ─────────────────────────────────────────────────────
  showInviteModal = signal(false);
  showCreateCardModal = signal(false);
  showDetailModal = signal(false);
  showSettingsModal = signal(false);
  showProfileModal  = signal(false);
  createCardTargetListId = signal<number | null>(null);

  // Context menu
  ctxOpen = signal(false);
  ctxX = 0;
  ctxY = 0;
  ctxListId = signal<number | null>(null);
  ctxIsArchived = signal(false);

  // Focus Mode
  focusMode = signal(false);

  // Board Chat
  showChat = signal(false);
  toggleChat() { this.showChat.update(v => !v); }

  // Detalle activo
  // (Declarado más abajo u oculto)

  // Drag & drop
  dragCardId = signal<number | null>(null);
  dragFromListId = signal<number | null>(null);
  dragOverListId = signal<number | null>(null);

  // Instancia de WS
  protected socket!: Socket;

  // Computed para el detalle de la tarjeta seleccionada
  activeCardDetail = computed(() => {
    const cardId = this.activeCardId();
    if (cardId === null) return null;
    return this.getCardDetail(cardId);
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadBoard(id);
        this.initSocket(id);
      }
    });
  }

  initSocket(boardId: number) {
    if (this.socket) {
      this.socket.disconnect();
    }
    // Nos conectamos a la api (url base)
    this.socket = io(environment.apiUrl.replace('/api/v1', ''), { transports: ['websocket'] });
    const user = this.authService.currentUser();
    this.socket.emit('join_board', { 
      boardId, 
      userId: user?.id, 
      userName: user?.nombre || 'Anónimo' 
    });

    // Escuchamos actualizaciones
    this.socket.on('board_updated', () => {
      this.loadListsSilently(boardId);
    });
  }

  ngOnDestroy() {
    if (this.socket) {
      if (this.board()) this.socket.emit('leave_board', this.board().id);
      this.socket.disconnect();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(e: KeyboardEvent) {
    const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
    const isEditing = tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable;
    if (isEditing) return;

    if (e.key === 'Escape') {
      if (this.focusMode()) { this.focusMode.set(false); return; }
      this.closeDetail();
    }
    if (e.key.toLowerCase() === 'f') {
      e.preventDefault();
      this.focusMode.update(v => !v);
    }
    if (e.key.toLowerCase() === 'g') {
      e.preventDefault();
      this.showChat.update(v => !v);
    }
  }

  loadListsSilently(boardId: number) {
    this.listService.getLists(boardId).subscribe(res => {
      if (res.success) {
        const sorted = res.data.sort((a: any, b: any) => a.posicion - b.posicion);
        
        const prevLists = this.lists();
        const mergedLists = sorted.map((l: any) => {
          const oldList = prevLists.find(pl => pl.id === l.id);
          return { ...l, cards: oldList?.cards || [] };
        });
        this.lists.set(mergedLists);
        
        // Cargar tarjetas
        sorted.forEach((list: any) => {
          this.cardService.getCards(boardId, list.id).subscribe(cardRes => {
            if (cardRes.success) {
              this.lists.update(prev =>
                prev.map(l => l.id === list.id ? { ...l, cards: cardRes.data } : l)
              );
            }
          });
        });
      }
    });
  }

  loadBoard(id: number) {
    this.boardService.getBoardById(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.board.set(res.data);
          this.loadLists(id);
          this.loadTags(id);
          this.loadActivity(id);
        }
      },
      error: () => this.router.navigate(['/dashboard'])
    });
  }

  loadActivity(boardId: number) {
    this.activityService.getActivity(boardId).subscribe(res => {
      if (res.success && res.data) {
        this.activity.set(res.data.activity || []);
      }
    });
  }

  loadTags(boardId: number) {
    this.tagService.getTags(boardId).subscribe(res => {
      if (res.success) {
        // El backend devuelve { tags: [...] } dentro de res.data
        this.tags.set(res.data?.tags || []);
      }
    });
  }

  loadLists(boardId: number) {
    this.listService.getLists(boardId).subscribe(res => {
      if (res.success) {
        // Preservamos las tarjetas existentes temporalmente para evitar parpadeo y cierre de modales
        const prevLists = this.lists();
        const mergedLists = res.data.map((l: any) => {
          const oldList = prevLists.find(pl => pl.id === l.id);
          return { ...l, cards: oldList?.cards || [] };
        });
        
        this.lists.set(mergedLists);

        // Cargar tarjetas para cada lista de forma asíncrona
        res.data.forEach((list: any) => {
          this.cardService.getCards(boardId, list.id).subscribe(cardRes => {
            if (cardRes.success) {
              const sortedCards = cardRes.data.sort((a: any, b: any) => (a.posicion ?? 0) - (b.posicion ?? 0));
              this.lists.update(prev =>
                prev.map(l => l.id === list.id ? { ...l, cards: sortedCards } : l)
              );
            }
          });
        });
      }
    });
  }

  // ── Computed Permissions ──────────────────────────────────────────
  userRole = computed(() => {
    const b = this.board();
    const u = this.authService.currentUser();
    if (!b || !u) return null;
    if (b.usuario_propietario_id === u.id) return 'admin';
    const member = b.miembros?.find((m: any) => m.id === u.id);
    return member ? member.rol : null;
  });

  isAdmin = computed(() => this.userRole() === 'admin');
  canEdit = computed(() => ['admin', 'editor'].includes(this.userRole() || ''));
  canComment = computed(() => ['admin', 'editor', 'comentador'].includes(this.userRole() || ''));
  
  // ── Filtros y Vistas ──────────────────────────────────────────────
  activeLists = computed(() => {
    const listData = this.filteredLists();
    if (this.filterBy() === 'archived') return listData.filter(l => l.archivada);
    return listData.filter(l => !l.archivada); 
  });

  allCards = computed(() => this.lists().flatMap(l => l.cards || []));

  filteredLists = computed(() => {
    const rawLists = this.lists();
    const filter   = this.filterBy();
    const mode     = this.viewMode();
    const userId   = this.authService.currentUser()?.id;

    if (!filter) return rawLists;

    return rawLists.map(l => {
      if (!l.cards) return l;
      
      const filteredCards = l.cards.filter(c => {
        if (filter === 'overdue') {
          return c.fecha_vencimiento && c.fecha_vencimiento < this.today && !c.completada;
        }
        if (filter === 'my-tasks') {
          return c.usuario_asignado_id === userId;
        }
        if (filter === 'attachments') {
          return (c as any).total_archivos > 0 || (c as any).attachments?.length > 0;
        }
        if (filter.startsWith('tag-')) {
          const tagId = parseInt(filter.split('-')[1]);
          return c.tags?.includes(tagId);
        }
        return true;
      });

      return { ...l, cards: filteredCards };
    });
  });

  // ── Computed helpers ──────────────────────────────────────────────
  allCardsFiltered = computed(() => {
    return this.activeLists().flatMap(l => l.cards || []);
  });

  getListNameForCard(card: Tarjeta): string {
    const list = this.lists().find(l => l.cards?.some(c => c.id === card.id));
    return list?.nombre || '—';
  }

  // ── Calendar Logic ──────────────────────────────────────────────
  calendarDays = computed(() => {
    const date = this.calendarDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);
    
    const days = [];
    
    // Rellenamos inicio con días del mes anterior
    const startOffset = firstDay.getDay(); 
    for(let i = startOffset; i > 0; i--) {
      days.push({
        date: new Date(year, month, 1 - i),
        isCurrentMonth: false
      });
    }
    
    // Días del mes actual
    for(let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Rellenamos final hasta completar semanas
    const endOffset = 42 - days.length; // 6 semanas fijas para evitar saltos de altura
    for(let i = 1; i <= endOffset; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  });

  calendarHeader = computed(() => {
    const d = this.calendarDate();
    return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();
  });

  prevMonth() {
    const d = this.calendarDate();
    this.calendarDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  nextMonth() {
    const d = this.calendarDate();
    this.calendarDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  getCardsForDate(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dStr = `${y}-${m}-${d}`;

    return this.allCardsFiltered().filter(c => {
       if (!c.fecha_vencimiento) return false;
       return c.fecha_vencimiento.startsWith(dStr);
    });
  }
  get overdueCount() { return this.allCards().filter(c => c.fecha_vencimiento && c.fecha_vencimiento < this.today && !c.completada).length; }
  get myTasksCount() {
    const userId = this.authService.currentUser()?.id;
    return this.allCards().filter(c => c.usuario_asignado_id === userId && !c.completada).length;
  }
  get archivedCount() { return this.lists().filter(l => l.archivada).length; }
  get attachmentsCount() { return this.allCards().reduce((s, c) => s + (c.attachments || 0), 0); }

  getMember(id: number | null) {
    return this.board()?.miembros?.find((m: any) => m.id === id) ?? null;
  }
  getTag(id: number | undefined | null) {
    if (id == null) return null;
    return this.tags().find(t => t.id === id) ?? null;
  }
  getList(id: number) { return this.lists().find(l => l.id === id) ?? null; }

  getCardDetail(id: number): { card: Tarjeta; list: Lista } | null {
    for (const l of this.lists()) {
      if (!l.cards) continue;
      const c = l.cards.find((c: Tarjeta) => c.id === id);
      if (c) return { card: c, list: l };
    }
    return null;
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
    if (!d) return '';
    if (d < this.today) return 'over';
    if (d === this.today) return 'today';
    return '';
  }

  // ── Modales ────────────────────────────────────────────────────────
  openInvite() { this.showInviteModal.set(true); }
  closeInvite() { this.showInviteModal.set(false); }

  openCreateCard(listId: number | null) {
    this.createCardTargetListId.set(listId ?? this.lists()[0]?.id ?? null);
    this.showCreateCardModal.set(true);
  }
  closeCreateCard() { this.showCreateCardModal.set(false); }

  openDetail(cardId: number) {
    this.activeCardId.set(cardId);
    this.showDetailModal.set(true);
  }
  closeDetail() {
    this.activeCardId.set(null);
    this.showDetailModal.set(false);
  }

  // ── Context menu ───────────────────────────────────────────────────
  openCtx(e: { event: MouseEvent; listId: number }) {
    e.event.preventDefault();
    e.event.stopPropagation();
    
    // Toggle behavior: Close if already open for this list
    if (this.ctxOpen() && this.ctxListId() === e.listId) {
       this.closeCtx();
       return;
    }

    this.ctxX = e.event.clientX;
    this.ctxY = e.event.clientY;
    this.ctxListId.set(e.listId);
    
    const list = this.getList(e.listId);
    this.ctxIsArchived.set(list?.archivada || false);
    
    this.ctxOpen.set(true);
  }

  closeCtx() { this.ctxOpen.set(false); }

  ctxAction(action: string) {
    this.ctxOpen.set(false);
    const listId = this.ctxListId();
    if (listId === null || !this.board()) return;

    const list = this.getList(listId);
    if (!list) return;

    if (action === 'rename') {
      const el = document.querySelector<HTMLInputElement>(`input[data-lid="${listId}"]`);
      el?.focus(); el?.select();
    }
    if (action === 'archive') {
      const bId = this.board().id;
      this.listService.archiveList(bId, listId).subscribe(() => {
        this.loadBoard(bId);
      });
    }

    if (action === 'unarchive') {
      const bId = this.board().id;
      this.listService.updateList(bId, listId, { archivada: false }).subscribe(() => {
        this.loadBoard(bId);
      });
    }

    if (action === 'delete') {
      this.notifService.confirm(`¿Eliminar lista "${list.nombre}"?`, 'Esta acción no se puede deshacer.').then(confirm => {
        if (confirm) {
          this.listService.deleteList(this.board().id, listId).subscribe(() => {
            this.loadLists(this.board().id);
          });
        }
      });
    }
  }

  // ── Eventos ────────────────────────────────────────────────────────
  onCardCreated(data: any) {
    if (!this.board()) return;
    const boardId = this.board().id;
    const listId = data.listId;

    this.cardService.createCard(boardId, listId, {
      titulo: data.titulo,
      descripcion: data.descripcion,
      prioridad: data.prioridad,
      fecha_vencimiento: data.fecha_vencimiento,
      usuario_asignado_id: data.usuario_asignado_id,
    }).subscribe({
      next: () => {
        this.loadLists(boardId);
        this.showCreateCardModal.set(false);
      },
      error: (err) => {
        console.error('Error al crear tarjeta:', err);
      }
    });
  }

  onInlineCardAdded(e: { listId: number; titulo: string }) {
    this.cardService.createCard(this.board().id, e.listId, { titulo: e.titulo }).subscribe(() => {
      this.loadLists(this.board().id);
    });
  }

  onCardDropped(payload: { event: CdkDragDrop<Tarjeta[]>, listId: number }) {
    const e = payload.event;
    if (!this.board()) return;

    const boardId = this.board().id;

    if (e.previousContainer === e.container) {
      if (e.previousIndex !== e.currentIndex) {
        moveItemInArray(e.container.data, e.previousIndex, e.currentIndex);
        const reorderPayload = e.container.data.map((c, i) => ({ id: c.id, posicion: i }));
        this.cardService.reorderCards(boardId, payload.listId, reorderPayload).subscribe();
      }
    } else {
      transferArrayItem(
        e.previousContainer.data,
        e.container.data,
        e.previousIndex,
        e.currentIndex
      );
      
      const card = e.container.data[e.currentIndex];
      const sourceListId = parseInt(e.previousContainer.id.replace('list-', ''), 10);
      const targetListId = payload.listId;

      this.cardService.moveCard(boardId, sourceListId, card.id, targetListId, e.currentIndex).subscribe();
    }
  }

  onCardMoved(e: { cardId: number; targetListId: number; targetCardId?: number }) {
    const boardId = this.board()?.id;
    if (!boardId) return;

    const sourceDetail = this.getCardDetail(e.cardId);
    if (!sourceDetail) return;

    this.cardService.moveCard(boardId, sourceDetail.list.id, e.cardId, e.targetListId, 0).subscribe({
      next: () => {
        this.loadLists(boardId);
        this.showDetailModal.set(false); // Cerrar tarjeta para indicar que se movió exitosamente
      },
      error: () => this.loadLists(boardId)
    });
  }

  onCardDeleted(cardId: number) {
    if (!this.board()) return;
    this.cardService.deleteCard(this.board().id, 0, cardId).subscribe(() => {
      this.loadLists(this.board().id);
      this.showDetailModal.set(false);
    });
  }

  onCardUpdated(e: CardUpdatedPayload) {
    const detail = this.getCardDetail(e.cardId);
    if (!detail || !this.board()) return;
    
    this.cardService.updateCard(this.board().id, detail.list.id, e.cardId, e).subscribe(() => {
      this.loadLists(this.board().id);
    });
  }

  onChecklistToggled(e: ChecklistTogglePayload) {
    const detail = this.getCardDetail(e.cardId);
    if (!detail || !this.board()) return;
    
    // Encontrar el item actual para saber su estado nuevo
    const item = detail.card.checklist?.items.find(i => i.id === e.itemId);
    if (!item) return;

    this.checklistService.updateChecklistItem(
      this.board().id, detail.list.id, e.cardId, e.checklistId, e.itemId, 
      { completado: !item.completado }
    ).subscribe(() => {
      this.loadLists(this.board().id);
    });
  }

  onChecklistItemAdded(e: ChecklistAddPayload) {
    const detail = this.getCardDetail(e.cardId);
    if (!detail || !this.board()) return;

    this.checklistService.addChecklistItem(
      this.board().id, detail.list.id, e.cardId, e.checklistId, e.texto
    ).subscribe(() => {
      this.loadLists(this.board().id);
    });
  }

  onCommentAdded(e: CommentAddPayload) {
    const detail = this.getCardDetail(e.cardId);
    if (!detail || !this.board()) return;

    this.commentService.addComment(
      this.board().id, detail.list.id, e.cardId, e.texto
    ).subscribe(() => {
      this.loadLists(this.board().id);
    });
  }

  onReminderAdded(e: ReminderAddPayload) {
    const detail = this.getCardDetail(e.cardId);
    if (!detail || !this.board()) return;

    this.reminderService.addReminder(
      this.board().id, detail.list.id, e.cardId, 
      { fecha: e.fecha, mensaje: e.texto }
    ).subscribe(() => {
      this.loadLists(this.board().id);
    });
  }

  onTagToggled(e: {cardId: number, tagId: number, assign: boolean}) {
    if (!this.board()) return;
    const req = e.assign 
      ? this.tagService.assignTagToCard(this.board().id, e.cardId, e.tagId)
      : this.tagService.removeTagFromCard(this.board().id, e.cardId, e.tagId);
      
    req.subscribe(() => {
      this.loadLists(this.board().id);
    });
  }

  onTagCreated(e: { nombre: string, color: string }) {
    if (!this.board()) return;
    this.tagService.createTag(this.board().id, e).subscribe(() => {
      this.loadTags(this.board().id);
    });
  }

  onMemberInvited(data: {email: string; rol: string}) { 
    if (!this.board()) return;
    this.invitationService.inviteMember(this.board().id, data.email, data.rol).subscribe({
      next: () => this.loadBoard(this.board().id),
      error: (err) => {
        this.notifService.notify(err.error?.message || err.error?.error || 'Error al enviar invitación', 'error');
      }
    });
  }

  onListAdded(nombre: string) {
    this.listService.createList(this.board().id, { nombre }).subscribe(() => {
      this.loadLists(this.board().id);
    });
  }

  onListRenamed(e: { listId: number; nombre: string }) {
    if (!this.board()) return;
    this.listService.updateList(this.board().id, e.listId, { nombre: e.nombre }).subscribe(() => {
      this.loadLists(this.board().id);
    });
  }

  onBackgroundChanged(file: File) {
    if (!this.board()) return;
    this.boardService.updateBoardBackground(this.board().id, file).subscribe(res => {
      if (res.success) {
        // Actualizamos el signal local para que cambie el fondo al instante
        this.board.set(res.data);
      }
    });
  }

  isImage(p: string | undefined | null): boolean {
    return !!p?.startsWith('url');
  }

  normalizeUrl(url: string | undefined | null): string {
    if (!url) return '';
    // Si contiene localhost y estamos en producción (o queremos forzar la ruta de Render)
    // lo reemplazamos por la URL del servidor actual.
    if (url.includes('localhost:3000')) {
      return url.replace('http://localhost:3000', environment.serverUrl);
    }
    return url;
  }

  handleLogout() {
    this.authService.logout();
  }

  onViewChanged(v: any) {
    this.viewMode.set(v);
    this.filterBy.set(null); // Reset all filters when switching views
  }

  onFilterChanged(f: string | null) {
    this.filterBy.set(f);
  }
}
