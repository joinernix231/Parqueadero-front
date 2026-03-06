import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ParkingTicket } from '../../../shared/models/parking-ticket.model';
import { PriceCalculation } from '../../services/ticket.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-ticket-preview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './ticket-preview.component.html',
  styleUrl: './ticket-preview.component.scss'
})
export class TicketPreviewComponent {
  @Input() ticket: ParkingTicket | null = null;
  @Input() priceCalculation: PriceCalculation | null = null;

  get elapsedTime(): string {
    if (!this.priceCalculation) return '0.00';
    const hours = Math.floor(this.priceCalculation.total_hours);
    const minutes = Math.floor((this.priceCalculation.total_hours - hours) * 60);
    return `${hours}h ${minutes}m`;
  }

  get formattedEntryTime(): string {
    if (!this.ticket?.entry_time) return 'N/A';
    try {
      let dateTime = DateTime.fromISO(this.ticket.entry_time);
      
      if (!dateTime.isValid) {
        dateTime = DateTime.fromSQL(this.ticket.entry_time);
      }
      
      if (!dateTime.isValid) {
        dateTime = DateTime.fromFormat(this.ticket.entry_time, 'yyyy-MM-dd HH:mm:ss');
      }
      
      if (!dateTime.isValid) {
        // Fallback a Date nativo
        const nativeDate = new Date(this.ticket.entry_time);
        if (!isNaN(nativeDate.getTime())) {
          return nativeDate.toLocaleString('es-ES');
        }
        return this.ticket.entry_time;
      }
      
      return dateTime.toLocaleString(DateTime.DATETIME_MED);
    } catch (error) {
      try {
        return new Date(this.ticket.entry_time).toLocaleString('es-ES');
      } catch (e) {
        return this.ticket.entry_time || 'N/A';
      }
    }
  }

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

  get vehicleTypeLabel(): string {
    const types: Record<string, string> = {
      'car': 'Automóvil',
      'motorcycle': 'Motocicleta',
      'truck': 'Camión'
    };
    return types[this.ticket?.vehicle?.vehicle_type || 'car'] || 'N/A';
  }
}

