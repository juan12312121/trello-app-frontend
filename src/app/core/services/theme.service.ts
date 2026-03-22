import { Injectable, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark' | 'purple' | 'emerald' | 'rose' | 'ocean' | 'sunset' | 'forest';
export type AppFont  = 'Inter' | 'Roboto' | 'Outfit' | 'Montserrat' | 'Poppins';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  currentTheme = signal<AppTheme>('light');
  currentFont  = signal<AppFont>('Inter');

  private readonly themes: AppTheme[] = ['light', 'dark', 'purple', 'emerald', 'rose', 'ocean', 'sunset', 'forest'];

  constructor() {
    this.initTheme();
    this.initFont();
  }

  private initTheme() {
    const saved = localStorage.getItem('theme') as AppTheme;
    if (saved && this.themes.includes(saved)) {
      this.currentTheme.set(saved);
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme.set(isDark ? 'dark' : 'light');
    }
    this.applyTheme();
  }

  private initFont() {
    const saved = localStorage.getItem('app_font') as AppFont;
    if (saved) {
      this.setFont(saved);
    }
  }

  setTheme(theme: AppTheme) {
    this.currentTheme.set(theme);
    this.applyTheme();
    localStorage.setItem('theme', theme);
  }

  setFont(font: AppFont) {
    this.currentFont.set(font);
    document.documentElement.style.setProperty('--main-font', `"${font}", sans-serif`);
    localStorage.setItem('app_font', font);
  }

  cycleTheme() {
    const currentIndex = this.themes.indexOf(this.currentTheme());
    const nextIndex = (currentIndex + 1) % this.themes.length;
    this.setTheme(this.themes[nextIndex]);
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
