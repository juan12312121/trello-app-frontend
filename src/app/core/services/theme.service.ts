import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type AppTheme = 'light' | 'dark' | 'purple' | 'emerald' | 'rose' | 'ocean' | 'sunset' | 'forest';
export type AppFont  = 'Inter' | 'Roboto' | 'Outfit' | 'Montserrat' | 'Poppins';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  currentTheme = signal<AppTheme>('light');
  currentFont  = signal<AppFont>('Inter');
  
  private platformId = inject(PLATFORM_ID);

  private readonly themes: AppTheme[] = ['light', 'dark', 'purple', 'emerald', 'rose', 'ocean', 'sunset', 'forest'];

  constructor() {
    this.initTheme();
    this.initFont();
  }

  private initTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('theme') as AppTheme;
      if (saved && this.themes.includes(saved)) {
        this.currentTheme.set(saved);
      } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentTheme.set(isDark ? 'dark' : 'light');
      }
      this.applyTheme();
    }
  }

  private initFont() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('app_font') as AppFont;
      if (saved) {
        this.setFont(saved);
      }
    }
  }

  setTheme(theme: AppTheme) {
    this.currentTheme.set(theme);
    this.applyTheme();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', theme);
    }
  }

  setFont(font: AppFont) {
    this.currentFont.set(font);
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.style.setProperty('--main-font', `"${font}", sans-serif`);
      localStorage.setItem('app_font', font);
    }
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
    if (isPlatformBrowser(this.platformId)) {
      const theme = this.currentTheme();
      document.documentElement.setAttribute('data-theme', theme === 'light' ? '' : theme);
    }
  }
}
