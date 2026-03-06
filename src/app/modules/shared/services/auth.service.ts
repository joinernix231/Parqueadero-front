import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { User, LoginRequest, AuthResponse } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  // Signals para estado reactivo
  private _currentUser = signal<User | null>(this.getStoredUser());
  currentUser = this._currentUser.asReadonly();

  private _isAuthenticated = signal<boolean>(this.hasToken());
  isAuthenticated = this._isAuthenticated.asReadonly();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<{ token: string; user: User }>('/login', credentials).pipe(
      tap(response => {
        if (response.data) {
          this.setAuthData(response.data.token, response.data.user);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.apiService.post('/logout', {}).pipe(
      tap(() => {
        this.clearAuthData();
        this.router.navigate(['/login']);
      })
    );
  }

  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.apiService.get<User>('/me').pipe(
      tap(response => {
        if (response.data) {
          this.setUser(response.data);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  getUser(): User | null {
    return this._currentUser();
  }

  isAdmin(): boolean {
    return this._currentUser()?.role === 'admin';
  }

  isOperator(): boolean {
    return this._currentUser()?.role === 'operator';
  }

  isGuard(): boolean {
    return this._currentUser()?.role === 'guard';
  }

  private setAuthData(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this._currentUser.set(user);
    this._isAuthenticated.set(true);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this._currentUser.set(user);
  }

  clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
}

