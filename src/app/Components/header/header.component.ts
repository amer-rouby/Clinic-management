import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../Services/theme.service';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../Services/Auth.service';
import { Subscription } from 'rxjs';
import { SharedMaterialModule } from '../../../Shared/modules/shared.material.module';
import { LanguageService } from '../../Services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SharedMaterialModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentLang: string;
  themeColor = 'primary';
  private themeSubscription!: Subscription;
  private langSubscription!: Subscription;

  // Available options for theme and language
  themeOptions = ['primary', 'accent'];
  languages = ['en', 'ar'];

  constructor(
    public themeService: ThemeService,
    private languageService: LanguageService,
    private authService: AuthService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.langSubscription = this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.updateDirection();
    });
  }

  ngOnInit(): void {
    this.initializeTheme();
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
    this.langSubscription?.unsubscribe();
  }

  private initializeTheme(): void {
    if (this.isBrowser()) {
      const savedTheme = localStorage.getItem('themeColor');
      if (savedTheme) {
        this.themeColor = savedTheme;
        this.themeService.setThemeColor(savedTheme);
      }
    }

    this.themeSubscription = this.themeService.themeColor$.subscribe(color => {
      this.themeColor = color;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  changeThemeColor(color: string): void {
    this.themeService.setThemeColor(color);
    if (this.isBrowser()) {
      localStorage.setItem('themeColor', color);
    }
  }

  changeLanguage(language: string): void {
    this.languageService.setLanguage(language);
  }

  private updateDirection(): void {
    const direction = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.document.documentElement.lang = this.currentLang;
    this.document.documentElement.dir = direction;
  }

  getThemeColor(): string {
    return this.themeColor === 'primary' ? '#003366' : '#b03060';
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
