import { Injectable } from '@angular/core';
import { TranslateService as NgxTranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  constructor(private translate: NgxTranslateService) {}

  /**
   * Get translated string for the given key
   * @param key - Translation key
   * @param interpolateParams - Parameters for string interpolation
   * @returns Translated string
   */
  instant(key: string, interpolateParams?: any): string {
    return this.translate.instant(key, interpolateParams);
  }

  /**
   * Change the current language
   * @param language - Language code
   */
  use(language: string): void {
    this.translate.use(language);
  }

  /**
   * Get the current language
   * @returns Current language code
   */
  getCurrentLanguage(): string {
    return this.translate.currentLang;
  }
}
