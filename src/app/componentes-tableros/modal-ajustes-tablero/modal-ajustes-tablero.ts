import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagService } from '../../core/services/tag.service';
import { BoardService } from '../../core/services/board.service';
import { MemberService } from '../../core/services/member.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { getInitials } from '../../core/utils/functions';

import { BaseModalComponent } from '../../core/classes/base-modal.component';

@Component({
  selector: 'app-modal-ajustes-tablero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-ajustes-tablero.html',
  styleUrl: './modal-ajustes-tablero.css'
})
export class ModalAjustesTableroComponent extends BaseModalComponent {
  board = input.required<any>();
  tags = input.required<any[]>();
  isAdmin = input<boolean>(false);

  boardChanged = output<void>();

  private boardService = inject(BoardService);
  private tagService = inject(TagService);
  private memberService = inject(MemberService);
  private router = inject(Router);
  private notifService = inject(NotificationService);

  public getInitials = getInitials;

  activeTab = signal<'general' | 'members' | 'tags' | 'background'>('general');

  // Tag Form
  newTagNombre = signal('');
  newTagColor = signal('#3b82f6');
  editingTagId = signal<number | null>(null);

  // --- GENERAL ---
  async archiveBoard() {
    const confirm = await this.notifService.confirm('¿Archivar tablero?', 'Podrás recuperarlo después si es necesario.');
    if (confirm) {
      this.boardService.archiveBoard(this.board().id).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }

  async deleteBoard() {
    const confirm = await this.notifService.confirm('PELIGRO: ¿Eliminar tablero?', 'Esta acción NO se puede deshacer y borrará todos los datos.');
    if (confirm) {
      this.boardService.deleteBoard(this.board().id).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }

  // --- MIEMBROS ---
  changeRole(userId: number, newRole: string) {
    if (!this.isAdmin()) return;
    this.memberService.updateMemberRole(this.board().id, userId, newRole).subscribe(() => {
      this.boardChanged.emit();
    });
  }

  removeMember(userId: number) {
    if (!this.isAdmin()) return;
    this.notifService.confirm('¿Expulsar miembro?', 'El usuario ya no tendrá acceso a este tablero.').then(confirm => {
      if (confirm) {
        this.memberService.removeMember(this.board().id, userId).subscribe(() => {
          this.boardChanged.emit();
        });
      }
    });
  }

  // --- ETIQUETAS ---
  saveTag() {
    const editId = this.editingTagId();
    const tagData = { nombre: this.newTagNombre(), color: this.newTagColor() };
    
    if (editId) {
      this.tagService.updateTag(this.board().id, editId, tagData).subscribe(() => {
        this.resetTagForm();
        this.boardChanged.emit();
      });
    } else {
      this.tagService.createTag(this.board().id, tagData).subscribe(() => {
        this.resetTagForm();
        this.boardChanged.emit();
      });
    }
  }

  editTag(tag: any) {
    this.editingTagId.set(tag.id);
    this.newTagNombre.set(tag.nombre);
    this.newTagColor.set(tag.color);
  }

  deleteTag(tagId: number) {
    this.notifService.confirm('¿Eliminar etiqueta?', 'Se quitará de todas las tarjetas del tablero.').then(confirm => {
      if (confirm) {
        this.tagService.deleteTag(this.board().id, tagId).subscribe(() => {
          if (this.editingTagId() === tagId) this.resetTagForm();
          this.boardChanged.emit();
        });
      }
    });
  }

  resetTagForm() {
    this.editingTagId.set(null);
    this.newTagNombre.set('');
    this.newTagColor.set('#3b82f6');
  }

  // --- FONDO (BACKGROUND) ---
  newBgColor = signal('#93c5fd');

  applyBgColor() {
    if (!this.isAdmin()) return;
    this.boardService.updateBoard(this.board().id, { portada: this.newBgColor() }).subscribe(() => {
      this.boardChanged.emit();
    });
  }

  applyPredefinedBg(colorClass: string) {
    if (!this.isAdmin()) return;
    this.boardService.updateBoard(this.board().id, { portada: colorClass }).subscribe(() => {
      this.boardChanged.emit();
    });
  }

  applyBgImage(event: Event) {
    if (!this.isAdmin()) return;
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.boardService.updateBoardBackground(this.board().id, file).subscribe(() => {
      this.boardChanged.emit();
    });
  }
}
