import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface FooterColumn {
  title: string;
  links: { label: string; href: string; isRoute?: boolean }[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class AppFooter {
  year = new Date().getFullYear();

  columns: FooterColumn[] = [
    {
      title: 'Producto',
      links: [
        { label: 'Características', href: '#features' },
        { label: 'Demo',            href: '#demo' },
        { label: 'Precios',         href: '#pricing' },
        { label: 'Cómo funciona',   href: '#how' },
      ],
    },
    {
      title: 'Cuenta',
      links: [
        { label: 'Iniciar sesión', href: '/login', isRoute: true },
        { label: 'Crear cuenta',   href: '/register', isRoute: true },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Acerca de', href: '#' },
        { label: 'Blog',      href: '#' },
        { label: 'Carreras',  href: '#' },
        { label: 'Contacto',  href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacidad', href: '#' },
        { label: 'Términos',   href: '#' },
        { label: 'Cookies',    href: '#' },
      ],
    },
  ];
}
