import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  // Signals para estado de autenticación
  currentUser = signal<User | null>(null);
  token = signal<string | null>(null);
  isAuthenticated = computed(() => !!this.token());

  constructor() {
    this.loadStorage();
  }

  private loadStorage() {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        this.token.set(savedToken);
        this.currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        this.logout();
      }
    }
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        if (res.success) {
          this.token.set(res.data.token);
          this.currentUser.set(res.data.user);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      })
    );
  }

  register(userData: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/register`, userData).pipe(
      tap(res => {
        if (res.success) {
          this.token.set(res.data.token);
          this.currentUser.set(res.data.user);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      })
    );
  }

  logout() {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/auth/me`, data).pipe(
      tap(res => {
        if (res.success) {
          this.currentUser.set(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      })
    );
  }
}
