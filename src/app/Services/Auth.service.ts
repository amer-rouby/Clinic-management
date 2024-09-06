import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../environment/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private restAPIURL = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private APIKey = environment.firebaseConfig.apiKey;

  private signUpURL = `${this.restAPIURL}signUp?key=${this.APIKey}`;
  private signInURL = `${this.restAPIURL}signInWithPassword?key=${this.APIKey}`;

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private localStorageService: LocalStorageService, private router: Router) {
    this.checkSessionExpiration(); // Check session expiration on startup
  }

  private post(url: string, body: any, headers: HttpHeaders): Observable<any> {
    return this.http.post<any>(url, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  signUp(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password, returnSecureToken: true };
    return this.post(this.signUpURL, body, headers);
  }

  signIn(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password, returnSecureToken: true };
    return this.post(this.signInURL, body, headers).pipe(
      tap(response => {
        this.setToken(response.idToken);
        this.startSessionTimer(); // Start session timer on login
        this.isLoggedInSubject.next(true);
        this.router.navigate(['/home']);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  setToken(token: string): void {
    this.localStorageService.setItem('token', token);
    this.localStorageService.setItem('sessionStart', Date.now().toString()); // Store session start time
    this.isLoggedInSubject.next(true); // Update logged in state
  }

  getToken(): string | null {
    return this.localStorageService.getItem('token');
  }

  logout(): void {
    this.localStorageService.removeItem('token');
    this.localStorageService.removeItem('sessionStart'); // Remove session start time on logout
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  private startSessionTimer() {
    // Set session duration (30 minutes)
    const sessionDuration = 30 * 60 * 1000;
    setTimeout(() => {
      this.logout(); // Log out after the specified time
    }, sessionDuration);
  }

  private checkSessionExpiration() {
    const sessionStart = this.localStorageService.getItem('sessionStart');
    if (sessionStart) {
      const now = Date.now();
      const sessionDuration = 30 * 60 * 1000; // 30 minutes
      if (now - parseInt(sessionStart) > sessionDuration) {
        this.logout(); // Log out if session duration has expired
      } else {
        this.startSessionTimer(); // Start timer if session is still valid
      }
    }
  }
}
