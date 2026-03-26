import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { TicketListPresenter } from '../../presenters/ticket-list.presenter';
import { ParkingTicket } from '../../../shared/models/parking-ticket.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { TicketStateService } from '../../state/ticket-state.service';
import { formatDateTime } from '../../../../shared/utils/date-time.util';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTableModule,
    MatButtonToggleModule,
    LoadingSpinnerComponent,
    PaginationComponent
  ],
  providers: [TicketListPresenter],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss'
})
export class TicketListComponent implements OnInit {
  searchTerm = signal<string>('');
  searchSubject = new Subject<string>();
  viewMode = signal<'active' | 'history'>('active');

  get displayedColumns(): string[] {
    const baseColumns = ['id', 'vehicle', 'plate', 'parking_lot', 'entry_time', 'status', 'actions'];
    if (this.viewMode() === 'history') {
      // Insertar exit_time después de entry_time
      const exitTimeIndex = baseColumns.indexOf('entry_time') + 1;
      return [
        ...baseColumns.slice(0, exitTimeIndex),
        'exit_time',
        ...baseColumns.slice(exitTimeIndex)
      ];
    }
    return baseColumns;
  }

  constructor(
    private ticketListPresenter: TicketListPresenter,
    public ticketState: TicketStateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadTickets();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((search) => {
      this.loadTickets({ page: 1, search });
    });
  }

  loadTickets(options: { page?: number; search?: string } = {}): void {
    this.ticketListPresenter.loadTickets({
      ...options,
      viewMode: this.viewMode()
    });
  }

  get tickets(): ParkingTicket[] {
    return this.ticketState.tickets();
  }

  get isLoading(): boolean {
    return this.ticketState.loading();
  }

  get pagination() {
    return this.ticketState.pagination();
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onPageChange(page: number): void {
    this.loadTickets({ page, search: this.searchTerm() });
  }

  onViewModeChange(mode: 'active' | 'history'): void {
    this.viewMode.set(mode);
    this.loadTickets({ page: 1, search: this.searchTerm() });
  }

  get emptyStateMessage(): string {
    const isActive = this.viewMode() === 'active';
    if (this.searchTerm().trim()) {
      return isActive
        ? 'No se encontraron tickets activos para la búsqueda'
        : 'No se encontraron tickets en el historial para la búsqueda';
    }
    return isActive
      ? 'No hay tickets activos'
      : 'No hay tickets en el historial';
  }


  viewDetail(ticket: ParkingTicket): void {
    this.router.navigate(['/tickets', ticket.id]);
  }

  getVehiclePlate(ticket: ParkingTicket): string {
    return ticket.vehicle?.plate || 'N/A';
  }

  getVehicleName(ticket: ParkingTicket): string {
    return ticket.vehicle?.owner_name || 'N/A';
  }

  getParkingLotName(ticket: ParkingTicket): string {
    return ticket.parking_lot?.name || 'N/A';
  }

  getStatus(ticket: ParkingTicket): string {
    if (this.viewMode() === 'history') {
      // En historial, mostrar estado más detallado
      if (ticket.exit_time) {
        return ticket.is_paid ? 'Pagado' : 'Por Pagar';
      }
      return 'Activo';
    }
    // En activos, mostrar solo activo/finalizado
    return ticket.is_active ? 'Activo' : 'Finalizado';
  }

  getStatusClass(ticket: ParkingTicket): string {
    if (this.viewMode() === 'history') {
      // En historial, usar clases más específicas
      if (ticket.exit_time) {
        return ticket.is_paid ? 'status-paid' : 'status-pending-payment';
      }
      return 'status-active';
    }
    // En activos
    return ticket.is_active ? 'status-active' : 'status-finished';
  }

  formatDate(date: string): string {
    return formatDateTime(date, 'N/A');
  }

  createNewTicket(): void {
    this.router.navigate(['/tickets/entry']);
  }
}

