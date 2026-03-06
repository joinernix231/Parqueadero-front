import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TicketService } from '../services/ticket.service';
import { TicketStateService } from '../state/ticket-state.service';
import { AlertService } from '../../shared/services/alert.service';
import { EntryVehicleRequest } from '../../shared/models/parking-ticket.model';

@Injectable()
export class TicketEntryPresenter {
  constructor(
    private ticketService: TicketService,
    private ticketState: TicketStateService,
    private alertService: AlertService,
    private router: Router
  ) {}

  async registerEntry(data: EntryVehicleRequest): Promise<void> {
    try {
      this.ticketState.setLoading(true);
      const response = await firstValueFrom(this.ticketService.entryVehicle(data));
      
      if (response?.data) {
        this.ticketState.setCurrentTicket(response.data);
        this.alertService.showSuccess('Entrada registrada exitosamente');
        
        // Descargar PDF automáticamente después de registrar entrada
        try {
          await this.ticketService.downloadEntryReceipt(response.data.id);
        } catch (pdfError) {
          console.error('Error al descargar recibo:', pdfError);
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


