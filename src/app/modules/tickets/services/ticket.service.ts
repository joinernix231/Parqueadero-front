import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import { AuthService } from '../../shared/services/auth.service';
import { ParkingTicket, EntryVehicleRequest, ExitVehicleRequest } from '../../shared/models/parking-ticket.model';
import { ApiResponse, PaginatedResponse } from '../../shared/models/api-response.model';
import { environment } from '../../../../environments/environment';

export interface PriceCalculation {
  ticket_id: number;
  total_hours: number;
  hourly_rate_applied: number;
  total_amount: number;
  entry_time: string;
  calculated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  entryVehicle(data: EntryVehicleRequest): Observable<ApiResponse<ParkingTicket>> {
    return this.apiService.post<ParkingTicket>('/parking/entry', data);
  }

  exitVehicle(data: ExitVehicleRequest): Observable<ApiResponse<ParkingTicket>> {
    return this.apiService.post<ParkingTicket>('/parking/exit', data);
  }

  getTicketById(id: number): Observable<ApiResponse<ParkingTicket>> {
    return this.apiService.get<ParkingTicket>(`/parking/tickets/${id}`);
  }

  getTicketByPlate(plate: string): Observable<ApiResponse<ParkingTicket>> {
    return this.apiService.get<ParkingTicket>(`/parking/tickets/by-plate/${plate}`);
  }

  calculatePrice(ticketId: number): Observable<ApiResponse<PriceCalculation>> {
    return this.apiService.get<PriceCalculation>(`/parking/tickets/${ticketId}/calculate-price`);
  }

  async downloadEntryReceipt(ticketId: number): Promise<void> {
    try {
      const token = this.authService.getToken();
      const url = `${this.apiUrl}/parking/tickets/${ticketId}/receipt/entry`;
      
      const blob = await firstValueFrom(
        this.http.get(url, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      );

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `recibo-entrada-${ticketId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading entry receipt:', error);
      throw error;
    }
  }

  async downloadExitReceipt(ticketId: number): Promise<void> {
    try {
      const token = this.authService.getToken();
      const url = `${this.apiUrl}/parking/tickets/${ticketId}/receipt/exit`;
      
      const blob = await firstValueFrom(
        this.http.get(url, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      );

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `recibo-salida-${ticketId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading exit receipt:', error);
      throw error;
    }
  }

  getHistory(params?: Record<string, any>): Observable<PaginatedResponse<ParkingTicket>> {
    return this.apiService.getPaginated<ParkingTicket>('/parking/history', params);
  }

  getCurrentVehicles(params?: Record<string, any>): Observable<ApiResponse<ParkingTicket[]>> {
    return this.apiService.get<ParkingTicket[]>('/parking/current', params);
  }

  getCurrentVehiclesPaginated(params?: Record<string, any>): Observable<PaginatedResponse<ParkingTicket>> {
    return this.apiService.getPaginated<ParkingTicket>('/parking/current', {
      paginate: true,
      ...params
    });
  }
}




