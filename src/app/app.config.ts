import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { environment } from '../environment/environment';
import { ErrorInterceptor } from '../Shared/Interceptors/error.interceptor';
import { SuccessInterceptor } from '../Shared/Interceptors/Succes.interceptor';
import { AppTranslateModule } from '../Shared/modules/app-translate.module';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withFetch()),
        provideRouter(routes, withComponentInputBinding()),
        provideClientHydration(),
        provideAnimationsAsync(),
        provideToastr(),
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideFirestore(() => getFirestore()),
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: SuccessInterceptor, multi: true },
        importProvidersFrom(HttpClientModule),
        importProvidersFrom(AppTranslateModule.forRoot())
    ]
};
