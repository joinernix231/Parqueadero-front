import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TicketService, PriceCalculation } from '../services/ticket.service';
import { TicketStateService } from '../state/ticket-state.service';
import { AlertService } from '../../shared/services/alert.service';
import { ExitVehicleRequest, ParkingTicket } from '../../shared/models/parking-ticket.model';

@Injectable()
export class TicketExitPresenter {
  constructor(
    private ticketService: TicketService,
    private ticketState: TicketStateService,
    private alertService: AlertService,
    private router: Router
  ) {}

  async searchTicketByPlate(plate: string): Promise<ParkingTicket | null> {
    try {
      const response = await firstValueFrom(this.ticketService.getTicketByPlate(plate));
      
      if (response?.data) {
        this.ticketState.setCurrentTicket(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      // Si no hay ticket activo para esa placa, devolvemos null y listo.
      if (error instanceof HttpErrorResponse && error.status === 404) return null;
      return null;
    }
  }

  async calculatePrice(ticketId: number): Promise<PriceCalculation | null> {
    try {
      const response = await firstValueFrom(this.ticketService.calculatePrice(ticketId));
      return response?.data || null;
    } catch {
      return null;
    }
  }

  async downloadReceiptBeforeExit(ticketId: number): Promise<void> {
    try {
      await this.ticketService.downloadEntryReceipt(ticketId);
    } catch (error) {
      throw error;
    }
  }

  async registerExit(data: ExitVehicleRequest): Promise<void> {
    try {
      this.ticketState.setLoading(true);
      const response = await firstValueFrom(this.ticketService.exitVehicle(data));
      
      if (response?.data) {
        this.ticketState.setCurrentTicket(response.data);
        this.alertService.showSuccess('Salida registrada exitosamente');
        
        // Opción de descargar PDF de salida
        try {
          await this.ticketService.downloadExitReceipt(response.data.id);
        } catch {
          this.alertService.showInfo('Salida registrada. No se pudo descargar el recibo automaticamente.');
        }
        
        this.router.navigate(['/tickets']);
      }
    } catch (error) {
      throw error;
    } finally {
      this.ticketState.setLoading(false);
    }
  }
}




