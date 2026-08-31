import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth-guard'; 

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/unauthorized/unauthorized').then((m) => m.Unauthorized),
  },
  // Ruta protegida
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
    canActivate: [authGuard],
    data: { permission: 'ROLE_ADMIN' }, // Metadata leída por el Guard
  },
  { path: '**', redirectTo: 'login' },
];
