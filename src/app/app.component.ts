import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Components/header/header.component';
import { FirebaseService } from './Services/Firebase.service';
import { SharedMaterialModule } from '../Shared/modules/shared.material.module';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from './Services/Auth.service';
import { Subscription } from 'rxjs';
import { LoginComponent } from './auth/login/login.component';

@Component({
    selector: 'app-root',
    standalone: true,
    providers: [FirebaseService],
    imports: [
        RouterOutlet,
        HeaderComponent,
        SharedMaterialModule,
        LoginComponent
    ],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    translateService = inject(TranslateService);
    document = inject(DOCUMENT);
    authService = inject(AuthService);
    isLoggedIn = false;
    private loginSubscription: Subscription;

    ngOnInit(): void {
        this.initializeLanguageSettings();
        this.subscribeToLoginStatus();
    }

    private initializeLanguageSettings(): void {
        const defaultLang = 'ar';
        const lang = this.getLanguageFromStorage() || defaultLang;
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        this.translateService.setDefaultLang(lang);
        this.translateService.use(lang);
        this.setDocumentLanguageAttributes(lang, dir);
    }

    private getLanguageFromStorage(): string | null {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            return localStorage.getItem('lang');
        }
        return null;
    }

    private setDocumentLanguageAttributes(lang: string, dir: string): void {
        this.document.documentElement.lang = lang;
        this.document.documentElement.dir = dir;
    }

    private subscribeToLoginStatus(): void {
        this.loginSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
            this.isLoggedIn = isLoggedIn; // تحديث حالة تسجيل الدخول في التطبيق
        });
    }

    ngOnDestroy(): void {
        if (this.loginSubscription) {
            this.loginSubscription.unsubscribe(); // إلغاء الاشتراك عند تدمير المكون لتجنب التسريبات
        }
    }
}
