import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
  signal,
} from '@angular/core';
import { Auth } from '../services/auth'; // Asegura la ruta correcta a tu servicio Auth

@Directive({
  selector: '[appHasPermission]',
  standalone: true, // En Angular moderno las directivas son standalone
})
export class HasPermissionDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private auth = inject(Auth);

  // Signal para guardar el permiso requerido enviado por el HTML
  private requiredPermission = signal<string | null>(null);

  // Setter reactivo que actualiza el Signal del permiso requerido
  @Input('appHasPermission') set hasPermission(val: string) {
    this.requiredPermission.set(val);
  }

  private hasView = false;

  constructor() {
    // El effect se ejecuta automáticamente cada vez que cambia requiredPermission()
    // o el Signal auth.permissions() de nuestro servicio.
    effect(() => {
      const neededPermission = this.requiredPermission();
      const userPermissions = this.auth.permissions();

      const hasAccess = neededPermission ? userPermissions.includes(neededPermission) : false;

      // Si tiene permiso y el elemento no está renderizado, lo creamos
      if (hasAccess && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
      // Si pierde el permiso y el elemento está renderizado, lo destruimos del DOM
      else if (!hasAccess && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}
