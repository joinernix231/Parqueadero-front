import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from '../../../core/api/base-api.service';
import { PaginatedResponse, ApiResponse } from '../../../core/api/models/api-response.model';
import { ParkingTicket } from '../../shared/models/parking-ticket.model';

export interface DashboardStats {
  active_vehicles: number;
  total_revenue: number;
  total_tickets: number;
  occupancy_rate: number;
  total_spots: number;
  week_occupancy: number[];
  week_revenue: number[];
  week_days: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private readonly api: BaseApiService) {}

  getCurrentParkedVehicles(parkingLotId?: number): Observable<PaginatedResponse<ParkingTicket>> {
    const params = parkingLotId ? { parking_lot_id: parkingLotId } : {};
    // El endpoint /parking/current devuelve { data: ParkingTicket[] } no paginado
    return this.api.getResponse<ParkingTicket[]>('/parking/current', params).pipe(
      map(response => {
        const tickets = Array.isArray(response.data) ? response.data : [];
        return {
          data: tickets,
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: tickets.length,
            total: tickets.length
          }
        };
      })
    );
  }

  getRecentTickets(limit: number = 10): Observable<PaginatedResponse<ParkingTicket>> {
    // Solo para mostrar tickets recientes en la tabla, no para estadísticas
    // Limitar a máximo 99 para cumplir con las restricciones del backend
    const safeLimit = Math.min(Math.max(1, limit), 99);
    return this.api.getPaginated<ParkingTicket>('/parking/history', {
      per_page: safeLimit.toString(),
      page: '1'
    });
  }

  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    // Endpoint optimizado que devuelve solo estadísticas (números) sin cargar tickets completos
    // NO usa /parking/history, usa /dashboard/stats que es mucho más eficiente
    return this.api.getResponse<DashboardStats>('/dashboard/stats');
  }
}

