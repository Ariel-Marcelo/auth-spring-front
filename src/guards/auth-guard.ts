import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // 1. Obtener el permiso requerido desde la metadata de la ruta (definida en app.routes.ts)
  const requiredPermission = route.data['permission'] as string;

  // 2. Si el usuario está autenticado y tiene el permiso requerido, permitimos el paso
  if (auth.isAuthenticated() && auth.permissions().includes(requiredPermission)) {
    return true;
  }

  // 3. Si no tiene permisos, lo redirigimos a una ruta segura (ej. login o no autorizado)
  return router.createUrlTree(['/unauthorized']);
};
