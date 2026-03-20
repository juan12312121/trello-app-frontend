import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [],
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.css',
})
export class ContextMenu {
  open = input<boolean>(false);
  x    = input<number>(0);
  y    = input<number>(0);
  isArchived = input<boolean>(false);

  action = output<string>();
  closed = output<void>();
}
