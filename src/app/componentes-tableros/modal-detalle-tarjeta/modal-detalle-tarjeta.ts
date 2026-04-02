import { Component, input, output, signal, computed, OnInit, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Lista, Tarjeta, Tag } from '../../core/models';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AttachmentService } from '../../core/services/attachment.service';
import { ReminderService } from '../../core/services/reminder.service';
import { ChecklistService } from '../../core/services/checklist.service';
import { BoardService } from '../../core/services/board.service';
import { NotificationService } from '../../core/services/notification.service';
import { getInitials, fmtDate, fmtTime } from '../../core/utils/functions';
import { DomSanitizer } from '@angular/platform-browser';
import { marked } from 'marked';

export interface CardMovedPayload  { cardId: number; targetListId: number; }
export interface CardUpdatedPayload { 
  cardId: number; 
  titulo?: string; 
  descripcion?: string; 
  prioridad?: 'baja' | 'media' | 'alta';
  usuario_asignado_id?: number | null;
  fecha_vencimiento?: string | null;
  tiempo_estimado?: number;
  tiempo_dedicado?: number;
  completada?: boolean;
  portada?: string | null;
}
export interface ChecklistTogglePayload { cardId: number; checklistId: number; itemId: number; }
export interface ChecklistAddPayload    { cardId: number; checklistId: number; texto: string; }
export interface CommentAddPayload      { cardId: number; texto: string; }
export interface ReminderAddPayload     { cardId: number; fecha: string; texto: string; }

import { BaseModalComponent } from '../../core/classes/base-modal.component';

@Component({
  selector: 'app-modal-detalle-tarjeta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-detalle-tarjeta.html',
  styleUrl: './modal-detalle-tarjeta.css',
})
export class ModalDetalleTarjetaComponent extends BaseModalComponent implements OnInit {
  card    = input.required<Tarjeta>();
  list    = input.required<Lista>();
  lists   = input.required<Lista[]>();
  tags    = input.required<Tag[]>();
  members = input.required<any[]>();
  today   = input<string>('');
  canEdit = input<boolean>(false);
  canComment = input<boolean>(false);
  boardId = input.required<number>();
  
  cardUpdated      = output<CardUpdatedPayload>();
  cardMoved        = output<CardMovedPayload>();
  cardDeleted      = output<number>();
  tagToggled       = output<{cardId: number, tagId: number, assign: boolean}>();
  tagCreated       = output<{nombre: string, color: string}>();
  tagUpdated       = output<{id: number, nombre: string, color: string}>();
  checklistToggled = output<ChecklistTogglePayload>();
  checklistItemAdded = output<ChecklistAddPayload>();
  commentAdded     = output<CommentAddPayload>();
  reminderAdded    = output<ReminderAddPayload>();
  attachmentAdded  = output<File>();

  public authService = inject(AuthService);
  private attachmentService = inject(AttachmentService);
  private reminderService   = inject(ReminderService);
  private checklistService  = inject(ChecklistService);
  private boardService      = inject(BoardService);
  private notifService      = inject(NotificationService);
  private sanitizer         = inject(DomSanitizer);

  protected Math = Math;

  parsedDescription = computed(() => {
    const desc = this.descripcion();
    if (!desc) return this.sanitizer.bypassSecurityTrustHtml('');
    return this.sanitizer.bypassSecurityTrustHtml(marked.parse(desc) as string);
  });

  attachments = signal<any[]>([]);
  reminders   = signal<any[]>([]);
  isEditingDesc = signal(false);
  private _effect = effect(() => {
    const c = this.card();
    const l = this.list();
    untracked(() => {
      this.titulo.set(c.titulo);
      this.descripcion.set(c.descripcion ?? '');
      this.moveToListId.set(l.id);
      this.loadCardExtras(c.id);
    });
  });

  titulo      = signal('');
  descripcion = signal('');
  moveToListId = signal<number | null>(null);
  
  newChkItem  = signal('');
  showChkInput = signal(false);
  
  newComment  = signal('');

  showAssigneeSel = signal(false);
  showTagPicker   = signal(false);
  showCoverPicker = signal(false);
  isCreatingTag   = signal(false);
  editingTagId    = signal<number | null>(null);
  newTagNombre    = signal('');
  newTagColor     = signal('#3b82f6');
  showReminderInput = signal(false);
  remDate     = signal('');
  remNote     = signal('');

  ngOnInit() { }

  public getInitials = getInitials;
  public fmtDate     = fmtDate;
  public fmtTime     = fmtTime;

  commentColor(name: string | undefined): string {
    if (!name) return '#cbd5e1';
    const colors = ['#f43f5e', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#0ea5e9'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }
  getMember(id: number | null) { return this.members().find(m => m.id === id) ?? null; }
  getTag(id: number)           { return this.tags().find(t => t.id === id) ?? null; }

  dueClass(d: string | null): string {
    const t = this.today();
    if (!d || !t) return '';
    if (d < t) return 'over';
    if (d === t) return 'today';
    return '';
  }

  get checklistProgress() {
    const chk = this.card().checklist;
    if (!chk) return null;
    const tot  = chk.items.length;
    const done = chk.items.filter((i: any) => i.completado).length;
    const pct  = tot ? Math.round(done / tot * 100) : 0;
    return { tot, done, pct };
  }

  saveTitle() {
    const t = this.titulo().trim();
    if (t) this.cardUpdated.emit({ cardId: this.card().id, titulo: t });
  }

  saveDesc() {
    this.cardUpdated.emit({ cardId: this.card().id, descripcion: this.descripcion().trim() });
  }

  saveCard() {
    this.saveDesc();
    this.closed.emit();
  }

  cardHasTag(tId: number) {
    return this.card().tags?.includes(tId) ?? false;
  }

  toggleTag(tId: number) {
    const has = this.cardHasTag(tId);
    this.tagToggled.emit({ cardId: this.card().id, tagId: tId, assign: !has });
  }

  editTag(tag: Tag) {
    this.editingTagId.set(tag.id);
    this.newTagNombre.set(tag.nombre);
    this.newTagColor.set(tag.color);
    this.isCreatingTag.set(true);
  }

  addTag(e?: Event) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const n = this.newTagNombre().trim();
    if (!n) return;
    
    if (this.editingTagId()) {
      this.tagUpdated.emit({ id: this.editingTagId()!, nombre: n, color: this.newTagColor() });
    } else {
      this.tagCreated.emit({ nombre: n, color: this.newTagColor() });
    }
    
    this.newTagNombre.set('');
    this.newTagColor.set('#3b82f6');
    this.editingTagId.set(null);
    this.isCreatingTag.set(false);
  }

  cancelTagForm() {
    this.isCreatingTag.set(false);
    this.editingTagId.set(null);
    this.newTagNombre.set('');
  }

  toggleChk(itemId: number) {
    if (!this.card().checklist) return;
    this.checklistToggled.emit({ 
      cardId: this.card().id, 
      checklistId: this.card().checklist!.id, 
      itemId 
    });
  }

  addChkItem() {
    const t = this.newChkItem().trim();
    if (!t || !this.card().checklist) return;
    this.checklistItemAdded.emit({ 
      cardId: this.card().id, 
      checklistId: this.card().checklist!.id, 
      texto: t 
    });
    this.newChkItem.set('');
    this.showChkInput.set(false);
  }

  chkKey(e: KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); this.addChkItem(); }
    if (e.key === 'Escape') { this.showChkInput.set(false); this.newChkItem.set(''); }
  }

  // --- MENCIONES EN COMENTARIOS ---
  showMentions = signal(false);
  mentionSearch = signal('');

  filteredMembers = computed(() => {
    const term = this.mentionSearch().toLowerCase();
    return this.members().filter(m => m.nombre.toLowerCase().includes(term) || m.email.toLowerCase().includes(term));
  });

  onCommentInput(e: any) {
    const val = e.target.value;
    this.newComment.set(val);
    
    // Básica detección de arroba justo al escribir
    const match = val.match(/@(\w*)$/);
    if (match) {
      this.showMentions.set(true);
      this.mentionSearch.set(match[1]);
    } else {
      this.showMentions.set(false);
    }
  }

  selectMention(mem: any) {
    const val = this.newComment();
    // Elimina espacios en el nombre para una mención limpia
    const nameMention = mem.nombre.replace(/\s+/g, '');
    const newVal = val.replace(/@(\w*)$/, `@${nameMention} `);
    
    this.newComment.set(newVal);
    this.showMentions.set(false);
  }

  parseCommentText(text: string) {
    if (!text) return '';
    // Mapeamos temporalmente el safe html para evitar inyecciones 
    const isEncoded = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // Pinta las menciones (todo lo que arranque en arroba) de azul
    return isEncoded.replace(/@(\w+)/g, '<span class="mention" style="color:var(--primary-color, #3b82f6); font-weight:600; background:rgba(59,130,246,0.1); padding:0 4px; border-radius:4px; margin:0 2px;">@$1</span>');
  }

  submitComment() {
    const t = this.newComment().trim();
    if (!t) return;
    this.commentAdded.emit({ cardId: this.card().id, texto: t });
    this.newComment.set('');
    this.showMentions.set(false);
  }

  moveCard() {
    const tid = this.moveToListId();
    if (tid && tid !== this.list().id) {
      this.cardMoved.emit({ cardId: this.card().id, targetListId: tid });
    }
  }

  async deleteCard() {
    const confirm = await this.notifService.confirm('¿Eliminar tarjeta?', 'Esta acción no se puede deshacer.');
    if (confirm) {
      this.cardDeleted.emit(this.card().id);
    }
  }

  setCover(color: string | null) {
    if (!this.canEdit()) return;
    this.cardUpdated.emit({ cardId: this.card().id, portada: color });
    this.showCoverPicker.set(false);
  }

  onAssigneeChange(e: any) {
    const val = e.target.value ? +e.target.value : null;
    this.cardUpdated.emit({ cardId: this.card().id, usuario_asignado_id: val });
    this.showAssigneeSel.set(false);
  }

  onPriorityChange(e: any) {
    const p = e.target.value;
    this.cardUpdated.emit({ cardId: this.card().id, prioridad: p });
  }

  onDueDateChange(e: any) {
    const d = e.target.value || null;
    this.cardUpdated.emit({ cardId: this.card().id, fecha_vencimiento: d });
  }

  onChangeAssigned() { this.showAssigneeSel.set(!this.showAssigneeSel()); }
  
  onAddAttachment() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) this.uploadFile(file);
    };
    input.click();
  }

  private uploadFile(file: File) {
    this.attachmentService.uploadAttachment(this.boardId(), this.list().id, this.card().id, file).subscribe({
      next: () => this.loadCardExtras(this.card().id),
      error: (err) => this.notifService.notify(err.error?.message || 'Error al subir archivo.', 'error')
    });
  }

  downloadAtt(att: any) {
    this.attachmentService.downloadAttachment(this.boardId(), this.list().id, this.card().id, att.id, att.nombre_archivo);
  }

  isImage(att: any): boolean {
    return att.tipo_archivo?.startsWith('image/');
  }

  getAttUrl(att: any): string {
    const base = environment.apiUrl.replace('/api/v1', '');
    return `${base}/uploads/${att.ruta_archivo}`;
  }

  getFileIcon(att: any): string {
    const type = att.tipo_archivo || '';
    if (type.includes('pdf')) return '📄 PDF';
    if (type.includes('word') || type.includes('officedocument.word')) return '📝 DOC';
    if (type.includes('excel') || type.includes('officedocument.sheet')) return '📊 XLS';
    if (type.includes('zip') || type.includes('rar')) return '📦 ZIP';
    if (type.includes('text/plain')) return '📄 TXT';
    return '📎 ARCH';
  }

  formatSize(bytes: number): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  deleteAtt(attId: number) {
    this.notifService.confirm('¿Eliminar este adjunto?').then(confirm => {
      if (confirm) {
        this.attachmentService.deleteAttachment(this.boardId(), this.list().id, this.card().id, attId).subscribe(() => {
          this.loadCardExtras(this.card().id);
        });
      }
    });
  }

  deleteChecklist(id: number) {
    this.notifService.confirm('¿Eliminar esta lista de tareas?').then(confirm => {
       if (confirm) {
         this.checklistService.deleteChecklist(this.boardId(), this.list().id, this.card().id, id).subscribe(() => {
           this.loadCardExtras(this.card().id); 
         });
       }
    });
  }

  private loadCardExtras(cardId: number) {
    this.attachmentService.getAttachments(this.boardId(), this.list().id, cardId).subscribe(res => {
      this.attachments.set(res.data?.attachments || []);
    });
    this.reminderService.getReminders(this.boardId(), this.list().id, cardId).subscribe(res => {
      this.reminders.set(res.data?.reminders || []);
    });
  }
  
  onReminder() { this.showReminderInput.set(!this.showReminderInput()); }

  confirmReminder() {
    if (!this.remDate()) return;
    this.reminderService.addReminder(this.boardId(), this.list().id, this.card().id, {
      fecha_recordatorio: this.remDate(),
      tipo: 'en_app'
    }).subscribe(() => {
      this.loadCardExtras(this.card().id);
      this.showReminderInput.set(false);
      this.remDate.set('');
      this.remNote.set('');
    });
  }

  removeReminder(rid: number) {
    this.reminderService.deleteReminder(this.boardId(), this.list().id, this.card().id, rid).subscribe(() => {
      this.loadCardExtras(this.card().id);
    });
  }
}
