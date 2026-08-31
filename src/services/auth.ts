import { Service, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../environments/environment';

interface DecodedToken {
  sub: string;            // Nombre de usuario / email
  permissions?: string[]; // Permisos o roles
  exp?: number;           // Fecha de expiración
}

@Service()
export class Auth {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/auth`; 

  // Variable de estado del token en memoria (Signal)
  private _accessToken = signal<string | null>(null);
  
  // Signal público de solo lectura
  public accessToken = this._accessToken.asReadonly();

  // Computed reactivo para decodificar automáticamente al cambiar el token
  private decodedToken = computed<DecodedToken | null>(() => {
    const token = this._accessToken();
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return null;
    }
  });

  // Computed reactivos derivados de los Claims
  public username = computed(() => this.decodedToken()?.sub ?? null);
  public permissions = computed(() => this.decodedToken()?.permissions ?? []);
  public isAuthenticated = computed(() => !!this._accessToken());

  /**
   * Iniciar sesión
   * Incluimos withCredentials: true para recibir la cookie HttpOnly con el Refresh Token
   */
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, credentials, {
      withCredentials: true 
    }).pipe(
      tap(response => {
        this._accessToken.set(response.accessToken);
      })
    );
  }

  /**
   * Refrescar el token
   * Incluimos withCredentials: true para enviar la cookie HttpOnly al servidor
   */
  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/refresh`, {}, {
      withCredentials: true
    }).pipe(
      tap({
        next: response => this._accessToken.set(response.accessToken),
        error: err => {
          console.warn('No se pudo refrescar la sesión:', err);
          this.logoutState(); 
        }
      })
    );
  }

  /**
   * Cerrar sesión
   */
  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => this.logoutState())
    );
  }

  private logoutState(): void {
    this._accessToken.set(null);
  }
}
