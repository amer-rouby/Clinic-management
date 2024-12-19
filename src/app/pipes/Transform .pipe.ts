// import { AddDentalClinicComponent } from './../Components/Dental-clinic/add-dental-clinic/add-dental-clinic.component';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateText'
})
export class TranslateTextPipe implements PipeTransform {
  transform(textObj: { arabic: string; english: string }): string {
    const currentLang = localStorage.getItem('lang') || 'en'; // افتراض أن اللغة الافتراضية هي الإنجليزية
    return currentLang === 'ar' ? textObj.arabic : textObj.english;
  }
}
