import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeColorSubject = new BehaviorSubject<string>('primary');
  themeColor$ = this.themeColorSubject.asObservable();

  setThemeColor(color: string): void {
    this.themeColorSubject.next(color);
  }

  getThemeColor(): string {
    return this.themeColorSubject.value;
  }
}
