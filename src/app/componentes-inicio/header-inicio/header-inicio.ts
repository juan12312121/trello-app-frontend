import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../core/services/board.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-inicio.html',
  styleUrl: './header-inicio.css',
})
export class HeaderInicio {
  public boardService = inject(BoardService);
  public themeService = inject(ThemeService);
  showThemeMenu = signal(false);
  toggleSidebar = output<void>();
}
