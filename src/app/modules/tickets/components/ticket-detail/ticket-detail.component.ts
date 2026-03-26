import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { TicketService } from '../../services/ticket.service';
import { TicketStateService } from '../../state/ticket-state.service';
import { ParkingTicket } from '../../../shared/models/parking-ticket.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AlertService } from '../../../shared/services/alert.service';
import { ExitConfirmationDialogComponent } from './exit-confirmation-dialog.component';
import { PriceCalculation } from '../../services/ticket.service';
import { DateTime } from 'luxon';
import { formatDateTime } from '../../../../shared/utils/date-time.util';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss'
})
export class TicketDetailComponent implements OnInit {
  ticket = signal<ParkingTicket | null>(null);
  isLoading = signal<boolean>(false);
  calculatedPrice = signal<PriceCalculation | null>(null);
  ticketId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    public ticketState: TicketStateService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ticketId = +params['id'];
      this.loadTicket();
    });
  }

  async loadTicket(): Promise<void> {
    try {
      this.isLoading.set(true);
      const response = await firstValueFrom(this.ticketService.getTicketById(this.ticketId));
      if (response?.data) {
        this.ticket.set(response.data);
        if (response.data.is_active) {
          await this.calculateCurrentPrice();
        }
      }
    } catch (error) {
      this.alertService.showError('Error al cargar el ticket');
      this.router.navigate(['/tickets']);
    } finally {
      this.isLoading.set(false);
    }
  }

  async calculateCurrentPrice(): Promise<void> {
    try {
      const response = await firstValueFrom(this.ticketService.calculatePrice(this.ticketId));
      if (response?.data) {
        this.calculatedPrice.set(response.data);
      }
    } catch {
      this.alertService.showWarning('No se pudo calcular el precio en este momento.');
    }
  }

  async registerExit(): Promise<void> {
    const ticket = this.ticket();
    if (!ticket) return;

    // Mostrar diálogo de confirmación
    const dialogRef = this.dialog.open(ExitConfirmationDialogComponent, {
      width: '500px',
      data: {
        vehicle: ticket.vehicle,
        calculatedPrice: this.calculatedPrice()
      }
    });

    const confirmed = await firstValueFrom(dialogRef.afterClosed());
    
    if (!confirmed) {
      return; // Usuario canceló
    }

    try {
      this.ticketState.setLoading(true);
      const response = await firstValueFrom(
        this.ticketService.exitVehicle({ ticket_id: ticket.id })
      );
      
      if (response?.data) {
        this.alertService.showSuccess('Salida registrada exitosamente');
        
        // Descargar PDF de salida automáticamente
        try {
          await this.ticketService.downloadExitReceipt(response.data.id);
        } catch {
          this.alertService.showInfo('Salida registrada. No se pudo descargar el recibo automaticamente.');
        }
        
        // Recargar el ticket después de registrar la salida
        await this.loadTicket();
      }
    } catch (error) {
      // Error ya manejado en el interceptor
    } finally {
      this.ticketState.setLoading(false);
    }
  }

  async downloadEntryReceipt(): Promise<void> {
    try {
      await this.ticketService.downloadEntryReceipt(this.ticketId);
    } catch (error) {
      // Error ya manejado en el interceptor
    }
  }

  async downloadExitReceipt(): Promise<void> {
    try {
      await this.ticketService.downloadExitReceipt(this.ticketId);
    } catch (error) {
      // Error ya manejado en el interceptor
    }
  }

  formatDate(date: string | null): string {
    return formatDateTime(date, 'N/A');
  }

  /**
   * Formatea horas decimales a formato legible (horas y minutos)
   * Ejemplo: 0.03 -> "2 minutos", 1.5 -> "1 hora 30 minutos", 2.0 -> "2 horas"
   */
  formatHoursMinutes(hours: number): string {
    if (!hours || hours <= 0) return '0 minutos';
    
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    
    if (h === 0) {
      return `${m} ${m === 1 ? 'minuto' : 'minutos'}`;
    } else if (m === 0) {
      return `${h} ${h === 1 ? 'hora' : 'horas'}`;
    } else {
      return `${h} ${h === 1 ? 'hora' : 'horas'} ${m} ${m === 1 ? 'minuto' : 'minutos'}`;
    }
  }

  calculateHours(): number {
    const ticket = this.ticket();
    if (!ticket || !ticket.entry_time) return 0;
    
    const entryTime = DateTime.fromISO(ticket.entry_time);
    const exitTime = ticket.exit_time ? DateTime.fromISO(ticket.exit_time) : DateTime.now();
    
    const diff = exitTime.diff(entryTime, 'hours');
    return Math.round(diff.hours * 100) / 100;
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }
}

