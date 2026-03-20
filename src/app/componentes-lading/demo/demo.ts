import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MockMember {
  id: number;
  nombre: string;
  initials: string;
  color: string;
  rol: string;
}

interface MockTag {
  id: number;
  nombre: string;
  color: string;
}

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demo.html',
  styleUrls: ['./demo.css']
})
export class Demo implements OnInit {
  activeTab = signal<'boards' | 'tasks' | 'team' | 'reminders' | 'activity'>('boards');
  isPlaying = signal(false);
  private demoInterval: any;
  
  // Real system-like data
  board = signal({
    id: 1,
    nombre: 'Proyecto Principal',
    portada: 'c-blue',
    miembros: [
      { id: 1, nombre: 'Juan Pérez', initials: 'JP', color: '#3b82f6', rol: 'admin' },
      { id: 2, nombre: 'Ana García', initials: 'AG', color: '#10b981', rol: 'editor' },
      { id: 3, nombre: 'Carlos Ruiz', initials: 'CR', color: '#f59e0b', rol: 'viewer' }
    ]
  });

  tags = signal<MockTag[]>([
    { id: 1, nombre: 'Urgente', color: '#ef4444' },
    { id: 2, nombre: 'Diseño', color: '#8b5cf6' },
    { id: 3, nombre: 'Backend', color: '#3b82f6' }
  ]);

  columns = signal([
    {
      id: 1,
      nombre: 'Por hacer',
      cards: [
        { id: 101, titulo: 'Diseñar Landing Page', prioridad: 'alta', tags: [1, 2], assigned: 1, comments: 3, attachments: 2, checklist: { done: 2, tot: 5 } },
        { id: 102, titulo: 'Configurar API Auth', prioridad: 'media', tags: [3], assigned: 2, comments: 0, attachments: 0 }
      ]
    },
    {
      id: 2,
      nombre: 'En proceso',
      cards: [
        { id: 103, titulo: 'Refactorizar Sidebars', prioridad: 'alta', tags: [1, 2], assigned: 1, comments: 12, attachments: 4, checklist: { done: 8, tot: 10 } }
      ]
    },
    {
      id: 3,
      nombre: 'Revisión',
      cards: [
        { id: 104, titulo: 'Integrar WebSockets', prioridad: 'urgente', tags: [3], assigned: 2, comments: 5, attachments: 1 }
      ]
    },
    {
      id: 4,
      nombre: 'Completado',
      cards: [
        { id: 105, titulo: 'Setup inicial Angular', prioridad: 'baja', tags: [], assigned: 3, comments: 2, attachments: 0, checklist: { done: 1, tot: 1 } }
      ]
    }
  ]);

  activity = signal([
    { id: 1, usuario: 'Juan Pérez', usuario_nombre: 'Juan Pérez', board_nombre: 'Proyecto Principal', descripcion: 'movió "Refactorizar Sidebars" a En proceso', fecha: 'hace 2 min', fecha_creacion: new Date(Date.now() - 120000), tipo: 'move' },
    { id: 2, usuario: 'Ana García', usuario_nombre: 'Ana García', board_nombre: 'Proyecto Principal', descripcion: 'comentó en "Integrar WebSockets"', fecha: 'hace 5 min', fecha_creacion: new Date(Date.now() - 300000), tipo: 'comment' },
    { id: 3, usuario: 'Juan Pérez', usuario_nombre: 'Juan Pérez', board_nombre: 'Proyecto Principal', descripcion: 'creó la tarjeta "Diseñar Landing Page"', fecha: 'hace 10 min', fecha_creacion: new Date(Date.now() - 600000), tipo: 'create' },
    { id: 4, usuario: 'Carlos Ruiz', usuario_nombre: 'Carlos Ruiz', board_nombre: 'Marketing', descripcion: 'completó "Diseño de Flyer"', fecha: 'hace 15 min', fecha_creacion: new Date(Date.now() - 900000), tipo: 'complete' }
  ]);

  reminders = signal([
    { id: 1, card_titulo: 'Diseñar Landing Page', tipo: 'Vencimiento', fecha_recordatorio: new Date(Date.now() + 86400000), completado: false },
    { id: 2, card_titulo: 'Refactorizar Sidebars', tipo: 'Recordatorio', fecha_recordatorio: new Date(Date.now() + 3600000), completado: false },
    { id: 3, card_titulo: 'Integrar WebSockets', tipo: 'Vencimiento', fecha_recordatorio: new Date(Date.now() - 3600000), completado: false },
    { id: 4, card_titulo: 'Setup inicial Angular', tipo: 'Vencimiento', fecha_recordatorio: null, completado: true }
  ]);

  ngOnInit() {
  }

  setTab(tab: 'boards' | 'tasks' | 'team' | 'reminders' | 'activity') {
    this.activeTab.set(tab);
  }

  playDemo() {
    if (this.isPlaying()) return;
    this.isPlaying.set(true);

    const steps = [
      () => this.setTab('tasks'),
      () => this.setTab('reminders'),
      () => this.setTab('activity'),
      () => {
        this.setTab('boards');
        this.columns.update(cols => {
          const newCols = [...cols];
          const card = newCols[0].cards.shift();
          if (card) newCols[1].cards.push(card);
          return newCols;
        });
      },
      () => this.isPlaying.set(false)
    ];

    let i = 0;
    this.demoInterval = setInterval(() => {
      if (i < steps.length) {
        steps[i]();
        i++;
      } else {
        this.stopDemo();
      }
    }, 2500);
  }

  stopDemo() {
    if (this.demoInterval) {
      clearInterval(this.demoInterval);
      this.demoInterval = null;
    }
    this.isPlaying.set(false);
  }

  getMember(id: number | null) {
    return this.board().miembros.find(m => m.id === id);
  }

  getTag(id: number) {
    return this.tags().find(t => t.id === id);
  }

  get totalCards() {
    return this.columns().reduce((acc, col) => acc + col.cards.length, 0);
  }
}
