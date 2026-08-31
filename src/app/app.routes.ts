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
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
    canActivate: [authGuard],
    data: { permission: 'invoices:read' }, // Permiso exacto retornado por AuthController en tu Spring Boot
  },
  { path: '**', redirectTo: 'login' },
];
