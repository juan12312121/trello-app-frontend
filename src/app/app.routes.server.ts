import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Landing pública → Pre-renderizada en build (máximo SEO)
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  // Rutas de auth → Client-side (no necesitan SEO)
  {
    path: 'login',
    renderMode: RenderMode.Client
  },
  {
    path: 'register',
    renderMode: RenderMode.Client
  },
  // Dashboard protegido → Client-side 
  {
    path: 'dashboard',
    renderMode: RenderMode.Client
  },
  // Tablero con parámetro dinámico :token → Server (renderizado bajo demanda, NO pre-render)
  {
    path: 'board/:token',
    renderMode: RenderMode.Server
  },
  // Comodín: cualquier otra ruta → Client
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
