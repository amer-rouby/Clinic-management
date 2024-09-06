import { HttpClient } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';

export function httpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "assets/i18n/", '.json');
}

export function translateCompilerFactory(): TranslateMessageFormatCompiler {
  return new TranslateMessageFormatCompiler();
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      },
      compiler: {
        provide: TranslateCompiler,
        useFactory: translateCompilerFactory
      }
    })
  ],
  exports: [TranslateModule]
})
export class AppTranslateModule {
  static forRoot(): ModuleWithProviders<AppTranslateModule> {
    return {
      ngModule: AppTranslateModule,
      providers: []
    };
  }

  static forChild(): ModuleWithProviders<AppTranslateModule> {
    return {
      ngModule: AppTranslateModule,
      providers: []
    };
  }
}

