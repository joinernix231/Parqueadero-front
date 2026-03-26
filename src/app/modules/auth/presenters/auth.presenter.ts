import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { AlertService } from '../../shared/services/alert.service';
import { LoginRequest } from '../../../core/auth/models/auth.model';

@Injectable()
export class AuthPresenter {
  private _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {}

  async login(credentials: LoginRequest): Promise<void> {
    try {
      this._isLoading.set(true);
      await firstValueFrom(this.authService.login(credentials));

      const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'] || '/dashboard';
      this.alertService.showSuccess('Inicio de sesión exitoso');
      this.router.navigateByUrl(returnUrl);
    } catch {
      // El errorInterceptor ya mostró el mensaje al usuario.
    } finally {
      this._isLoading.set(false);
    }
  }

  async logout(): Promise<void> {
    try {
      this._isLoading.set(true);
      await firstValueFrom(this.authService.logout());
    } catch {
      this.authService.clearAuthData();
    } finally {
      this._isLoading.set(false);
      this.router.navigate(['/login']);
    }
  }

  checkAuthStatus(): void {
    if (!this.authService.isAuthenticated()) {
      this.authService.clearAuthData();
      return;
    }

    this.authService.refreshSession().subscribe({
      error: () => this.authService.clearAuthData()
    });
  }
}
