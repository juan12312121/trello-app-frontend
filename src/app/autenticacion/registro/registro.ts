import { Component, AfterViewInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements AfterViewInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  ngAfterViewInit() {
    const form         = document.getElementById('registerForm') as HTMLFormElement;
    const errorAlert   = document.getElementById('errorAlert')!;
    const successAlert = document.getElementById('successAlert')!;
    const submitBtn    = document.getElementById('submitBtn') as HTMLButtonElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    const showAlert = (el: HTMLElement, msg: string, show: boolean) => {
      el.textContent = msg;
      el.classList.toggle('show', show);
    };

    // Indicador de fortaleza de contraseña
    passwordInput.addEventListener('input', () => {
      const val = passwordInput.value;
      const fill = document.getElementById('strengthFill')!;
      const text = document.getElementById('strengthText')!;
      const met = [
        val.length >= 6,
        /\d/.test(val),
        /[A-Z]/.test(val),
        /[^a-zA-Z0-9]/.test(val),
      ].filter(Boolean).length;

      const levels: Record<number, [string, string]> = {
        0: ['', 'Débil'],
        1: ['fair', 'Regular'],
        2: ['fair', 'Regular'],
        3: ['good', 'Buena'],
        4: ['strong', 'Muy fuerte'],
      };
      const [cls, label] = levels[met] ?? ['', 'Débil'];
      fill.className = `strength-fill ${cls}`.trim();
      text.textContent = label;
    });

    // Submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showAlert(errorAlert, '', false);
      showAlert(successAlert, '', false);

      const nombre          = (document.getElementById('nombre') as HTMLInputElement).value.trim();
      const apellido        = (document.getElementById('apellido') as HTMLInputElement).value.trim();
      const email           = (document.getElementById('email') as HTMLInputElement).value.trim();
      const password        = (document.getElementById('password') as HTMLInputElement).value;
      const passwordConfirm = (document.getElementById('passwordConfirm') as HTMLInputElement).value;
      const terms           = (document.getElementById('terms') as HTMLInputElement).checked;

      if (nombre.length < 2)          { showAlert(errorAlert, 'El nombre debe tener al menos 2 caracteres', true); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showAlert(errorAlert, 'Email inválido', true); return; }
      if (password.length < 6)        { showAlert(errorAlert, 'La contraseña debe tener al menos 6 caracteres', true); return; }
      if (password !== passwordConfirm){ showAlert(errorAlert, 'Las contraseñas no coinciden', true); return; }
      if (!terms)                      { showAlert(errorAlert, 'Debes aceptar los términos de servicio', true); return; }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Creando cuenta...';

      this.authService.register({ 
        nombre: `${nombre} ${apellido}`.trim(), 
        email, 
        password 
      }).subscribe({
        next: (result) => {
          if (result.success) {
            showAlert(successAlert, 'Cuenta creada. Redirigiendo...', true);
            setTimeout(() => this.router.navigate(['/dashboard']), 1500);
          } else {
            showAlert(errorAlert, result.message || 'Error al crear la cuenta', true);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Crear cuenta';
          }
        },
        error: () => {
          showAlert(errorAlert, 'Error de conexión. Intenta de nuevo.', true);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Crear cuenta';
        }
      });
    });
  }
}
