import { Injectable, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark' | 'purple' | 'emerald' | 'rose' | 'ocean' | 'sunset' | 'forest';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  currentTheme = signal<AppTheme>('light');

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    const saved = localStorage.getItem('theme') as AppTheme;
    if (saved) {
      this.currentTheme.set(saved);
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme.set(isDark ? 'dark' : 'light');
    }
    this.applyTheme();
  }

  setTheme(theme: AppTheme) {
    this.currentTheme.set(theme);
    this.applyTheme();
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const next = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  private applyTheme() {
    const theme = this.currentTheme();
    document.documentElement.setAttribute('data-theme', theme === 'light' ? '' : theme);
  }
}
