import { Injectable } from '@angular/core';
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
    } catch (error: unknown) {
      // El interceptor ya maneja y muestra los errores HTTP del backend
      // Solo retornamos null si es un 404 (ticket no encontrado es esperado)
      const httpError = error as any;
      if (httpError?.status === 404) {
        // No mostrar error para 404, es esperado cuando no se encuentra ticket
        return null;
      }
      // Para otros errores, el interceptor ya los muestra
      return null;
    }
  }

  async calculatePrice(ticketId: number): Promise<PriceCalculation | null> {
    try {
      const response = await firstValueFrom(this.ticketService.calculatePrice(ticketId));
      return response?.data || null;
    } catch (error: unknown) {
      // El interceptor ya maneja y muestra los errores HTTP del backend
      return null;
    }
  }

  async downloadReceiptBeforeExit(ticketId: number): Promise<void> {
    try {
      await this.ticketService.downloadEntryReceipt(ticketId);
    } catch (error: unknown) {
      // El interceptor ya maneja y muestra los errores HTTP del backend
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
        } catch (pdfError) {
          console.error('Error al descargar recibo de salida:', pdfError);
          // No mostrar error al usuario, solo loguear
        }
        
        this.router.navigate(['/tickets']);
      }
    } catch (error: unknown) {
      // El interceptor ya maneja y muestra los errores HTTP del backend
      // Solo relanzamos el error para que el componente pueda manejarlo si es necesario
      throw error;
    } finally {
      this.ticketState.setLoading(false);
    }
  }
}




