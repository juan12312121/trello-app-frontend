import { Component, output, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agregar-lista',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (canEdit()) {
      <div class="add-col-wrap">

        @if (!visible()) {
          <button class="add-col-btn" (click)="show()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Agregar lista
        </button>
      } @else {
        <div class="add-col-form">
          <input
            class="add-col-input"
            placeholder="Nombre de la lista"
            maxlength="200"
            autofocus
            [value]="nombre()"
            (input)="nombre.set($any($event.target).value)"
            (keydown)="onKey($event)">
          <div class="inline-acts">
            <button class="btn-confirm" (click)="confirm()">Agregar lista</button>
            <button class="btn-xsm" (click)="hide()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      }

      </div>
    }
  `,
  styles: [`
    .add-col-wrap { 
      width: var(--col-w); 
      min-width: var(--col-w); 
      flex-shrink: 0; 
      opacity: 0.9;
      transition: opacity 0.2s;
    }
    .add-col-wrap:hover { opacity: 1; }

    .add-col-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 14px 18px;
      background: rgba(255, 255, 255, 0.4); 
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 2px dashed rgba(255, 255, 255, 0.5); 
      border-radius: var(--r-xl);
      color: #fff; /* High contrast on dark backgrounds */
      font-size: .9rem; font-weight: 700;
      font-family: inherit; cursor: pointer; width: 100%;
      transition: all .2s var(--ease);
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    .add-col-btn svg { width: 18px; height: 18px; }
    .add-col-btn:hover { 
      background: rgba(255, 255, 255, 0.6); 
      border-color: #fff; 
      transform: translateY(-2px);
      box-shadow: var(--sh-md);
    }

    .add-col-form {
      background: rgba(255, 255, 255, 0.95); 
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: var(--r-xl); 
      padding: 14px;
      box-shadow: var(--sh-xl);
      animation: slideIn 0.2s var(--ease);
    }

    @keyframes slideIn {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .add-col-input {
      width: 100%; padding: 12px 14px;
      border: 2px solid var(--blue); border-radius: var(--r-lg);
      font-family: inherit; font-weight: 600; font-size: 0.92rem; color: var(--t1);
      background: var(--surface); outline: none; margin-bottom: 10px;
      transition: all 0.2s var(--ease);
    }
    .add-col-input:focus { box-shadow: var(--sh-focus); }

    .inline-acts { display: flex; align-items: center; gap: 8px; }
    .btn-confirm {
      padding: 8px 16px; background: var(--blue); color: #fff;
      border: none; border-radius: var(--r-md);
      font-size: .82rem; font-weight: 700; font-family: inherit;
      cursor: pointer; transition: all .2s var(--ease);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }
    .btn-confirm:hover { 
      background: var(--blue-d); 
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
    }
    .btn-xsm {
      width: 32px; height: 32px; border: none; background: none;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      color: var(--t3); border-radius: var(--r-md); transition: all .2s var(--ease);
    }
    .btn-xsm svg { width: 18px; height: 18px; }
    .btn-xsm:hover { background: rgba(0,0,0,0.05); color: var(--rose); }
  `],
})
export class AgregarListaComponent {
  listAdded = output<string>();
  canEdit = input<boolean>(true);

  visible = signal(false);
  nombre  = signal('');

  show()  { this.visible.set(true); }
  hide()  { this.visible.set(false); this.nombre.set(''); }

  confirm() {
    const n = this.nombre().trim();
    if (!n) return;
    this.listAdded.emit(n);
    this.hide();
  }

  onKey(e: KeyboardEvent) {
    if (e.key === 'Enter') this.confirm();
    if (e.key === 'Escape') this.hide();
  }
}
