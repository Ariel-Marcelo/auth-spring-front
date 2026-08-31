import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const requiredPermission = route.data['permission'] as string | undefined;

  // 1. Si no hay permiso requerido explícito en la ruta, solo validamos que esté autenticado
  if (!requiredPermission && auth.isAuthenticated()) {
    return true;
  }

  // 2. Si se requiere un permiso específico (ej. 'invoices:read'), validamos que esté en los permisos del token
  if (auth.isAuthenticated() && requiredPermission && auth.permissions().includes(requiredPermission)) {
    return true;
  }

  // 3. Si no está autenticado o no tiene el permiso, bloqueamos y redirigimos
  return router.createUrlTree(['/unauthorized']);
};
