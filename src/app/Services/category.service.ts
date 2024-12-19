import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  getCategoryTypes() {
    return [
      { id: 1, arabic: 'مبتدئين', english: 'Beginners' },
      { id: 2, arabic: 'متوسط', english: 'Intermediate' },
      { id: 3, arabic: 'متقدم', english: 'Advanced' },
      { id: 4, arabic: 'أخرى', english: 'Other' },
    ];
  }
}
