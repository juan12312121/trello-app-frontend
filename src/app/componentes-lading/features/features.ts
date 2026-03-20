import { Component } from '@angular/core';

@Component({
  selector: 'app-features',
  imports: [],
  templateUrl: './features.html',
  styleUrl: './features.css',
})
export class Features {
  features = [
    {
      icon: 'view_kanban',
      title: 'Tableros Inteligentes',
      description: 'Crea tableros con columnas drag-and-drop. Organiza tu flujo de trabajo exactamente como lo necesitas.',
    },
    {
      icon: 'group',
      title: 'Colaboración en Tiempo Real',
      description: 'Invita a tu equipo y colabora instantáneamente. Ve quién trabaja en qué en tiempo real.',
    },
    {
      icon: 'bar_chart',
      title: 'Análisis Detallados',
      description: 'Obtén insights sobre productividad del equipo con gráficos y reportes automáticos.',
    },
    {
      icon: 'notifications_active',
      title: 'Notificaciones Inteligentes',
      description: 'Recibe alertas personalizadas sin ser bombardeado. Solo las que importan.',
    },
    {
      icon: 'hub',
      title: 'Integraciones',
      description: 'Conecta con Slack, GitHub, Google Drive y más de 100 herramientas.',
    },
    {
      icon: 'shield',
      title: 'Seguridad Enterprise',
      description: 'Encriptación end-to-end, autenticación SSO y cumplimiento GDPR.',
    },
  ];
}
