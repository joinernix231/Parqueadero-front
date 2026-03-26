import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { TokenStorageService } from '../auth/token-storage.service';
import { AlertService } from '../../modules/shared/services/alert.service';

function extractErrorMessage(error: HttpErrorResponse): string {
  // Si hay un mensaje directo en error.error.message (ej: {"message":"El vehículo ya tiene un ticket activo"})
  if (error.error?.message) return error.error.message;

  // Si hay errores de validación (422) con estructura errors
  if (error.error?.errors && typeof error.error.errors === 'object') {
    const validationErrors = error.error.errors as Record<string, string[] | string>;
    const firstError = Object.values(validationErrors)[0];
    if (Array.isArray(firstError) && firstError.length > 0) return firstError[0] as string;
    if (typeof firstError === 'string') return firstError;
  }

  if (typeof error.error === 'string') return error.error;

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
  const tokenStorage = inject(TokenStorageService);
  const alertService = inject(AlertService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        alertService.showError(error.error.message || 'Error de conexión. Verifica tu internet.');
        return throwError(() => error);
      }

      const url = error.url ?? '';

      // Un 401 fuera del endpoint de login significa sesión expirada o revocada.
      if (error.status === 401 && !url.endsWith('/login')) {
        tokenStorage.clear();
        router.navigate(['/login']);
        return throwError(() => error);
      }

      // 404 en búsqueda por placa es un resultado esperado, no un error de usuario.
      const isSilent404 = error.status === 404 && url.includes('/vehicles/search-by-plate');
      if (!isSilent404) alertService.showError(extractErrorMessage(error));

      return throwError(() => error);
    })
  );
};

