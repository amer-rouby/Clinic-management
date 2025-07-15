import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { TranslateService } from './translate.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLangSubject: BehaviorSubject<string> = new BehaviorSubject<string>('ar');
  currentLang$ = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {
    // Check for saved language preference in localStorage
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      this.setLanguage(savedLang);
    } else {
      this.setLanguage('ar'); // Default language
    }
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLangSubject.next(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
  }

  toggleLanguage(): void {
    const newLang = this.currentLangSubject.value === 'ar' ? 'en' : 'ar';
    this.setLanguage(newLang);
  }

  getCurrentLang(): string {
    return this.currentLangSubject.value;
  }
}
