import { Component, output, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-modal-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-perfil.html',
  styleUrl: './modal-perfil.css',
})
export class ModalPerfilComponent implements OnInit {
  private authService = inject(AuthService);
  public themeService = inject(ThemeService);
  
  closed = output<void>();

  nombre = signal('');
  email  = signal('');
  password = signal('');
  
  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.nombre.set(user.nombre);
      this.email.set(user.email);
    }
  }

  save() {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    const data: any = {
      nombre: this.nombre(),
      email: this.email(),
    };

    if (this.password()) {
      data.password = this.password();
    }

    this.authService.updateProfile(data).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.success.set(true);
          setTimeout(() => this.success.set(false), 3000);
        } else {
          this.error.set(res.message || 'Error al actualizar perfil');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error de conexión');
      }
    });
  }
}
