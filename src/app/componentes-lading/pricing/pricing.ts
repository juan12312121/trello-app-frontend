import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Plan {
  badge: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  featured: boolean;
  link: string;
}

@Component({
  selector: 'app-pricing',
  imports: [RouterLink],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class Pricing {
  plans: Plan[] = [
    {
      badge: 'GRATUITO',
      name: 'Starter',
      price: '$0',
      period: 'Siempre gratis',
      features: ['Hasta 3 proyectos', 'Hasta 5 miembros', 'Soporte por email', 'Almacenamiento 100 MB'],
      cta: 'Comenzar Gratis',
      featured: false,
      link: '/register',
    },
    {
      badge: 'MÁS POPULAR',
      name: 'Professional',
      price: '$15',
      period: 'por usuario / mes',
      features: ['Proyectos ilimitados', 'Hasta 50 miembros', 'Soporte prioritario', 'Almacenamiento 10 GB', 'Reportes avanzados', 'Automatizaciones'],
      cta: 'Prueba 14 Días Gratis',
      featured: true,
      link: '/register',
    },
    {
      badge: 'ENTERPRISE',
      name: 'Empresa',
      price: 'Personalizado',
      period: 'contacta con ventas',
      features: ['Todo en Professional', 'Usuarios ilimitados', 'Soporte 24/7 dedicado', 'Almacenamiento ilimitado', 'SSO y controles avanzados', 'Integraciones personalizadas'],
      cta: 'Contactar Ventas',
      featured: false,
      link: '/register',
    },
  ];
}
