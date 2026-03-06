import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

/**
 * Extrae el mensaje de error de la respuesta del backend
 */
function extractErrorMessage(error: HttpErrorResponse): string {
  // Si hay un mensaje directo en error.error.message (ej: {"message":"El vehículo ya tiene un ticket activo"})
  if (error.error?.message) {
    return error.error.message;
  }

  // Si hay errores de validación (422) con estructura errors
  if (error.error?.errors && typeof error.error.errors === 'object') {
    const validationErrors = error.error.errors;
    const firstError = Object.values(validationErrors)[0];
    if (Array.isArray(firstError) && firstError.length > 0) {
      return firstError[0] as string;
    }
    if (typeof firstError === 'string') {
      return firstError;
    }
  }

  // Si el error es un string directamente
  if (typeof error.error === 'string') {
    return error.error;
  }

  // Mensajes por defecto según el código de estado
  switch (error.status) {
    case 0:
      return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    case 400:
      return 'Solicitud inválida. Por favor, verifica los datos enviados.';
    case 401:
      return 'No autorizado. Por favor, inicia sesión nuevamente.';
    case 403:
      return 'No tienes permisos para realizar esta acción.';
    case 404:
      return 'Recurso no encontrado.';
    case 422:
      return 'Error de validación. Por favor, verifica los datos ingresados.';
    case 500:
      return 'Error del servidor. Por favor, intenta más tarde.';
    case 503:
      return 'Servicio no disponible. Por favor, intenta más tarde.';
    default:
      return error.statusText || `Error ${error.status}: Ha ocurrido un error inesperado.`;
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const alertService = inject(AlertService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente (red, conexión, etc.)
        errorMessage = error.error.message || 'Error de conexión. Verifica tu internet.';
      } else {
        // Error del lado del servidor
        errorMessage = extractErrorMessage(error);

        // Manejo especial para errores de autenticación
        if (error.status === 401) {
          // Si el error es del endpoint /me o /user, redirigir inmediatamente al login
          const url = error.url || '';
          if (url.includes('/me') || url.includes('/user')) {
            authService.clearAuthData();
            router.navigate(['/login']);
            // No mostrar error para endpoints de auth que fallan
            return throwError(() => error);
          } else {
            // Para otros endpoints, intentar logout primero
            authService.logout().subscribe({
              next: () => router.navigate(['/login']),
              error: () => {
                authService.clearAuthData();
                router.navigate(['/login']);
              }
            });
          }
        }
      }

      // No mostrar error para casos esperados:
      // - 401 en endpoints de auth (/me, /user)
      // - 404 en búsqueda de vehículo por placa (es normal que no exista)
      const url = error.url || '';
      const isAuthError = error.status === 401 && (url.includes('/me') || url.includes('/user'));
      const isVehicleSearch404 = error.status === 404 && url.includes('/vehicles/search-by-plate');
      
      if (!isAuthError && !isVehicleSearch404) {
        alertService.showError(errorMessage);
      }

      return throwError(() => error);
    })
  );
};
