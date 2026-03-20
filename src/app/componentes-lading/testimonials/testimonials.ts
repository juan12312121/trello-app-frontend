import { Component } from '@angular/core';

export interface Testimonial {
  initials: string;
  name: string;
  role: string;
  text: string;
  color: string;
}

@Component({
  selector: 'app-testimonials',
  imports: [],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials {
  reviews: Testimonial[] = [
    {
      initials: 'JM',
      name: 'Juan Martínez',
      role: 'CEO, TechStart Co.',
      text: '"TaskFlow cambió completamente cómo trabajamos. Es intuitivo, poderoso y accesible. No podríamos estar más felices."',
      color: '#3b82f6',
    },
    {
      initials: 'SP',
      name: 'Sofía Pérez',
      role: 'Product Manager, Digital Agency',
      text: '"La mejor herramienta de gestión de proyectos que hemos probado. El equipo se adaptó en cuestión de horas."',
      color: '#10b981',
    },
    {
      initials: 'AC',
      name: 'Andrés Cerro',
      role: 'Director de Operaciones',
      text: '"Increíble ROI. Mejoramos nuestra productividad un 40% desde que implementamos TaskFlow."',
      color: '#f59e0b',
    },
  ];
}
