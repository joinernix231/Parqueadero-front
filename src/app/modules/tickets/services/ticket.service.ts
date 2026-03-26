import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { ParkingTicket, EntryVehicleRequest, ExitVehicleRequest } from '../../shared/models/parking-ticket.model';
import { ApiResponse, PaginatedResponse } from '../../../core/api/models/api-response.model';
import { ApiClient } from '../../../core/api/api-client.service';
import { BaseApiService } from '../../../core/api/base-api.service';

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
  constructor(
    private readonly apiClient: ApiClient,
    private readonly api: BaseApiService
  ) {}

  entryVehicle(data: EntryVehicleRequest): Observable<ApiResponse<ParkingTicket>> {
    return this.api.postResponse<ParkingTicket>('/parking/entry', data);
  }

  exitVehicle(data: ExitVehicleRequest): Observable<ApiResponse<ParkingTicket>> {
    return this.api.postResponse<ParkingTicket>('/parking/exit', data);
  }

  getTicketById(id: number): Observable<ApiResponse<ParkingTicket>> {
    return this.api.getResponse<ParkingTicket>(`/parking/tickets/${id}`);
  }

  getTicketByPlate(plate: string): Observable<ApiResponse<ParkingTicket>> {
    return this.api.getResponse<ParkingTicket>(`/parking/tickets/by-plate/${plate}`);
  }

  calculatePrice(ticketId: number): Observable<ApiResponse<PriceCalculation>> {
    return this.api.getResponse<PriceCalculation>(`/parking/tickets/${ticketId}/calculate-price`);
  }

  async downloadEntryReceipt(ticketId: number): Promise<void> {
    await this.downloadReceipt(ticketId, 'entry');
  }

  async downloadExitReceipt(ticketId: number): Promise<void> {
    await this.downloadReceipt(ticketId, 'exit');
  }

  getHistory(params?: Record<string, any>): Observable<PaginatedResponse<ParkingTicket>> {
    return this.api.getPaginated<ParkingTicket>('/parking/history', params);
  }

  getCurrentVehicles(params?: Record<string, any>): Observable<ApiResponse<ParkingTicket[]>> {
    return this.api.getResponse<ParkingTicket[]>('/parking/current', params);
  }

  getCurrentVehiclesPaginated(params?: Record<string, any>): Observable<PaginatedResponse<ParkingTicket>> {
    return this.api.getPaginated<ParkingTicket>('/parking/current', {
      paginate: true,
      ...params
    });
  }

  private async downloadReceipt(ticketId: number, type: 'entry' | 'exit'): Promise<void> {
    try {
      const blob = await firstValueFrom(
        this.apiClient.getBlob(`/parking/tickets/${ticketId}/receipt/${type}`)
      );

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `recibo-${type === 'entry' ? 'entrada' : 'salida'}-${ticketId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(`Error downloading ${type} receipt:`, error);
      throw error;
    }
  }
}




