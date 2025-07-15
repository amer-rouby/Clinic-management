import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../Services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../Services/Auth.service';
import { Subscription } from 'rxjs';
import { SharedMaterialModule } from '../../../Shared/modules/shared.material.module';

@Component({
  selector: 'app-header',
  standalone:true,
  imports:[SharedMaterialModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  selectedTheme: string | undefined;
  showThemeSelector = false;
  currentLang: string;
  loadingData = false;
  themeColor = 'primary';
  private themeSubscription!: Subscription;

  constructor(
    public themeService: ThemeService, // Changed to public
    private translate: TranslateService, 
    private authService: AuthService, 
    private router: Router, 
    @Inject(DOCUMENT) private document: Document
  ) {
    this.currentLang = this.translate.currentLang || 'ar';
    this.updateDirection();
  }

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.loadingData = true;
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/login']);
      this.loadingData = false;
    }, 500); 
  }

  changeThemeColor(color: string): void {
    this.selectedTheme = color;
    this.themeService.setThemeColor(color);
    if (this.isBrowser()) {
      localStorage.setItem('themeColor', color);
    }
  }

  showThemes(): void {
    this.showThemeSelector = !this.showThemeSelector;
  }

  toggleLanguage(): void {
    this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
    this.loadingData = true;
    setTimeout(() => {
      this.translate.use(this.currentLang);
      if (this.isBrowser()) {
        localStorage.setItem('lang', this.currentLang);
      }
      this.updateDirection();
      this.loadingData = false;
    }, 500); 
  }

  private updateDirection(): void {
    const dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.document.documentElement.lang = this.currentLang;
    this.document.documentElement.dir = dir;
  }

  getThemeColor(): any {
    return this.themeColor === 'primary' ? '#003366' : '#b03060'; 
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
