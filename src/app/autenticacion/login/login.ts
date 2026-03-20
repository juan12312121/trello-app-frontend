import { Component, AfterViewInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements AfterViewInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  ngAfterViewInit() {
    const form       = document.getElementById('loginForm') as HTMLFormElement;
    const errorAlert = document.getElementById('errorAlert')!;
    const successAlert = document.getElementById('successAlert')!;
    const submitBtn  = document.getElementById('submitBtn') as HTMLButtonElement;

    const showAlert = (el: HTMLElement, msg: string, show: boolean) => {
      el.textContent = msg;
      el.classList.toggle('show', show);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showAlert(errorAlert, '', false);
      showAlert(successAlert, '', false);

      const email    = (document.getElementById('email') as HTMLInputElement).value.trim();
      const password = (document.getElementById('password') as HTMLInputElement).value;

      if (!email || !password) {
        showAlert(errorAlert, 'Por favor completa todos los campos', true);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Iniciando sesión...';

      this.authService.login({ email, password }).subscribe({
        next: (result) => {
          if (result.success) {
            showAlert(successAlert, 'Login exitoso. Redirigiendo...', true);
            setTimeout(() => this.router.navigate(['/dashboard']), 1500);
          } else {
            showAlert(errorAlert, result.message || 'Error al iniciar sesión', true);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Iniciar sesión';
          }
        },
        error: () => {
          showAlert(errorAlert, 'Error de conexión. Intenta de nuevo.', true);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Iniciar sesión';
        }
      });
    });
  }
}
