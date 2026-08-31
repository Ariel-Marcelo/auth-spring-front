import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../services/auth';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  username = '';
  password = '';
  errorMessage = signal<string | null>(null);

  onLogin() {
    this.errorMessage.set(null);
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Error al iniciar sesión. Verifica las credenciales o si el backend está activo.');
      }
    });
  }
}
