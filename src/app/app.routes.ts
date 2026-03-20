import { Routes } from '@angular/router';
import { Landing } from './paginas/landing/landing';
import { Login } from './autenticacion/login/login';
import { Registro } from './autenticacion/registro/registro';
import { Inicio } from './paginas/inicio/inicio';
import { TablerosComponent } from './paginas/tableros/tableros';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Registro },
  { 
    path: 'dashboard', 
    component: Inicio,
    canActivate: [authGuard]
  },
  { 
    path: 'board/:id', 
    component: TablerosComponent,
    canActivate: [authGuard]
  },
];
