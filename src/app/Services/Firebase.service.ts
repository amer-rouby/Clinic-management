import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private databaseURL = "https://angular-courses-796a0-default-rtdb.firebaseio.com";
  private http = inject(HttpClient);

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.databaseURL}/${endpoint}.json`);
  }

  post<T>(endpoint: string, data: T): Observable<T> {
    return this.http.post<T>(`${this.databaseURL}/${endpoint}.json`, data);
  }

  put<T>(endpoint: string, data: T): Observable<void> {
    return this.http.put<void>(`${this.databaseURL}/${endpoint}.json`, data);
  }

  delete(endpoint: string): Observable<void> {
    return this.http.delete<void>(`${this.databaseURL}/${endpoint}.json`);
  }
}
