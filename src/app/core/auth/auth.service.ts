import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';

import { ApiClient } from '../api/api-client.service';
import { ApiResponse } from '../api/models/api-response.model';
import { LoginPayload, LoginRequest, User } from './models/auth.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly tokenStorage: TokenStorageService
  ) {}

  login(payload: LoginRequest): Observable<ApiResponse<LoginPayload>> {
    return this.apiClient.post<LoginPayload>('/login', payload).pipe(
      tap((response) => this.persistSession(response.data))
    );
  }

  logout(): Observable<ApiResponse<null>> {
    return this.apiClient.post<null>('/logout', {}).pipe(
      tap(() => this.clearAuthData())
    );
  }

  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.apiClient.get<User>('/me').pipe(
      tap((response) => this.tokenStorage.setUser(response.data))
    );
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  getUser(): User | null {
    return this.tokenStorage.getUser();
  }

  clearAuthData(): void {
    this.tokenStorage.clear();
  }

  refreshSession(): Observable<User | null> {
    if (!this.getToken()) return of(null);

    return this.getCurrentUser().pipe(map((response) => response.data));
  }

  private persistSession(payload: LoginPayload): void {
    this.tokenStorage.setToken(payload.token);
    this.tokenStorage.setUser(payload.user);
  }
}
