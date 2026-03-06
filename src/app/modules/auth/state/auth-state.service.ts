import { Injectable, signal } from '@angular/core';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private _user = signal<User | null>(null);
  private _isAuthenticated = signal<boolean>(false);
  private _isLoading = signal<boolean>(false);

  user = this._user.asReadonly();
  isAuthenticated = this._isAuthenticated.asReadonly();
  isLoading = this._isLoading.asReadonly();

  setUser(user: User | null): void {
    this._user.set(user);
    this._isAuthenticated.set(!!user);
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  clear(): void {
    this._user.set(null);
    this._isAuthenticated.set(false);
    this._isLoading.set(false);
  }
}





