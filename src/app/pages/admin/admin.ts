import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../../services/auth';
import { HasPermissionDirective } from '../../../directives/has-permission';
import { environment } from '../../../environments/environment';

@Component({
  imports: [HasPermissionDirective],
  selector: 'app-admin',
  styleUrl: './admin.css',
  templateUrl: './admin.html',
})
export class Admin {
  protected auth = inject(Auth);
  private router = inject(Router);
  private http = inject(HttpClient);

  protected invoiceMessage = signal<string | null>(null);

  protected getInvoices() {
    this.http.get<any>(`${environment.apiUrl}/auth/invoices`, { withCredentials: true }).subscribe({
      next: (res) => this.invoiceMessage.set(res.message + ' - Usuario: ' + res.user),
      error: (err) => this.invoiceMessage.set('Error: ' + (err.error?.message || err.message))
    });
  }

  protected deleteInvoice() {
    this.http.delete<any>(`${environment.apiUrl}/auth/invoices/123`, { withCredentials: true }).subscribe({
      next: (res) => this.invoiceMessage.set(res.message),
      error: (err) => this.invoiceMessage.set('Error: ' + (err.error?.message || err.message))
    });
  }

  protected onLogout() {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}
