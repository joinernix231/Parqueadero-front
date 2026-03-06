import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { AlertService } from '../../shared/services/alert.service';
import { AuthStateService } from '../state/auth-state.service';
import { LoginRequest } from '../../shared/models/user.model';

@Injectable()
export class AuthPresenter {
  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private authState: AuthStateService,
    private router: Router
  ) {}

  async login(credentials: LoginRequest): Promise<void> {
    try {
      this.authState.setLoading(true);
      
      const response = await firstValueFrom(this.authService.login(credentials));
      
      if (response?.data?.user) {
        this.authState.setUser(response.data.user);
        this.alertService.showSuccess('Inicio de sesión exitoso');
        
        const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      }
    } catch (error: unknown) {
      const errorMessage = (error as any)?.error?.message || 'Error al iniciar sesión';
      this.alertService.showError(errorMessage);
      throw error;
    } finally {
      this.authState.setLoading(false);
    }
  }

  async logout(): Promise<void> {
    try {
      this.authState.setLoading(true);
      await firstValueFrom(this.authService.logout());
      this.authState.clear();
      this.alertService.showSuccess('Sesión cerrada exitosamente');
    } catch (error: unknown) {
      // Incluso si hay error, limpiar el estado local
      this.authState.clear();
      this.router.navigate(['/login']);
    } finally {
      this.authState.setLoading(false);
    }
  }

  checkAuthStatus(): void {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getUser();
      if (user) {
        this.authState.setUser(user);
      } else {
        this.authService.getCurrentUser().subscribe({
          next: (response) => {
            if (response.data) {
              this.authState.setUser(response.data);
            }
          },
          error: () => {
            this.authState.clear();
          }
        });
      }
    }
  }
}

