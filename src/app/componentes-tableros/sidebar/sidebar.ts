import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Board, Lista, Tarjeta, Tag } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  board            = input.required<Board>();
  lists            = input.required<Lista[]>();
  tags             = input.required<Tag[]>();
  activity         = input.required<any[]>();
  otherBoards      = input.required<any[]>();
  cmap             = input.required<Record<string, string>>();
  overdueCount     = input<number>(0);
  myTasksCount     = input<number>(0);
  archivedCount    = input<number>(0);
  attachmentsCount = input<number>(0);
  activeView       = input<string>('kanban');
  activeFilter     = input<string | null>(null);
  
  openInvite        = output<void>();
  logout            = output<void>();
  backgroundChanged = output<File>();
  viewChanged       = output<string>();
  filterChanged     = output<string | null>();
  openCreateCard    = output<void>();
  openSettings      = output<void>();
  openProfile       = output<void>();

  private router = inject(Router);
  public authService = inject(AuthService);

  get activeLists() { return this.lists().filter(l => !l.archivada); }
  get totalCards()  { return this.lists().flatMap(l => l.cards || []).length; }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToBoard(id: number) {
    this.router.navigate(['/boards', id]);
  }

  triggerBgUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) this.backgroundChanged.emit(file);
    };
    input.click();
  }
}
