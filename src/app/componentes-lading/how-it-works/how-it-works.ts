import { Component } from '@angular/core';

export interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-how-it-works',
  imports: [],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.css',
})
export class HowItWorks {
  steps: Step[] = [
    {
      number: 1,
      icon: 'person_add',
      title: 'Crea tu equipo',
      description: 'Regístrate y crea tu equipo en segundos. No se requiere tarjeta de crédito.',
    },
    {
      number: 2,
      icon: 'send',
      title: 'Invita a tu equipo',
      description: 'Invita a tus colegas con un simple enlace. Comienzan a colaborar al instante.',
    },
    {
      number: 3,
      icon: 'rocket_launch',
      title: 'Empieza a trabajar',
      description: 'Crea proyectos, añade tareas y gestiona tu trabajo de manera eficiente.',
    },
  ];
}
