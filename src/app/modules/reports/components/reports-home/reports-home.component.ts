import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { TicketService } from '../../../tickets/services/ticket.service';
import { ParkingLotService } from '../../../parking-lots/services/parking-lot.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ExportService } from '../../../shared/services/export.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ParkingTicket } from '../../../shared/models/parking-ticket.model';
import { ParkingLot } from '../../../shared/models/parking-lot.model';
import { DateTime } from 'luxon';
import { formatDateTime } from '../../../../shared/utils/date-time.util';

interface ReportFilters {
  date_from?: string;
  date_to?: string;
  plate?: string;
  parking_lot_id?: number;
  status?: 'active' | 'completed';
}

type ReportType = 'all' | 'by_date' | 'by_parking_lot' | 'by_vehicle' | 'summary';

@Component({
  selector: 'app-reports-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './reports-home.component.html',
  styleUrl: './reports-home.component.scss'
})
export class ReportsHomeComponent implements OnInit {
  // Signals
  tickets = signal<ParkingTicket[]>([]);
  parkingLots = signal<ParkingLot[]>([]);
  isLoading = signal(false);
  isExporting = signal(false);
  
  // Pagination
  totalItems = 0;
  pageSize = 15;
  currentPage = 0;
  pageSizeOptions = [10, 15, 25, 50];
  
  // Filters
  filterForm: FormGroup;
  reportType: ReportType = 'all';
  
  // Stats
  stats = {
    totalRevenue: 0,
    totalTickets: 0,
    activeTickets: 0,
    paidTickets: 0,
    pendingTickets: 0
  };
  
  // Table
  displayedColumns: string[] = [
    'id',
    'plate',
    'parking_lot',
    'entry_time',
    'exit_time',
    'total_amount',
    'status',
    'actions'
  ];

  constructor(
    private ticketService: TicketService,
    private parkingLotService: ParkingLotService,
    private alertService: AlertService,
    private exportService: ExportService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      date_from: [null],
      date_to: [null],
      plate: [''],
      parking_lot_id: [null],
      status: [null]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadParkingLots();
    await this.loadReports();
  }

  async loadParkingLots(): Promise<void> {
    try {
      const response = await firstValueFrom(this.parkingLotService.getAll());
      if (response?.data) {
        this.parkingLots.set(response.data);
      }
    } catch {
      this.alertService.showWarning('No se pudo cargar la lista de estacionamientos.');
    }
  }

  async loadReports(): Promise<void> {
    try {
      this.isLoading.set(true);
      
      const filters = this.buildFilters();
      const params = {
        ...filters,
        page: (this.currentPage + 1).toString(),
        per_page: this.pageSize.toString()
      };

      const response = await firstValueFrom(
        this.ticketService.getHistory(params)
      );

      if (response?.data) {
        this.tickets.set(response.data);
        this.totalItems = response.meta?.total || 0;
        this.calculateStats(response.data);
      }
    } catch {
      this.alertService.showError('Error al cargar reportes');
    } finally {
      this.isLoading.set(false);
    }
  }

  buildFilters(): ReportFilters {
    const formValue = this.filterForm.value;
    const filters: ReportFilters = {};

    if (formValue.date_from) {
      filters.date_from = DateTime.fromJSDate(formValue.date_from).toFormat('yyyy-MM-dd');
    }
    if (formValue.date_to) {
      filters.date_to = DateTime.fromJSDate(formValue.date_to).toFormat('yyyy-MM-dd');
    }
    if (formValue.plate?.trim()) {
      filters.plate = formValue.plate.trim();
    }
    if (formValue.parking_lot_id) {
      filters.parking_lot_id = formValue.parking_lot_id;
    }
    if (formValue.status) {
      filters.status = formValue.status;
    }

    return filters;
  }

  calculateStats(tickets: ParkingTicket[]): void {
    this.stats = {
      totalRevenue: tickets
        .filter(t => t.exit_time && t.total_amount)
        .reduce((sum, t) => sum + (t.total_amount || 0), 0),
      totalTickets: tickets.length,
      activeTickets: tickets.filter(t => t.is_active).length,
      paidTickets: tickets.filter(t => t.is_paid).length,
      pendingTickets: tickets.filter(t => !t.is_paid && !t.is_active).length
    };
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadReports();
  }

  async onFilter(): Promise<void> {
    this.currentPage = 0;
    await this.loadReports();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.currentPage = 0;
    this.loadReports();
  }

  async exportToExcel(): Promise<void> {
    try {
      this.isExporting.set(true);
      
      // Obtener todos los tickets sin paginación para exportar
      const filters = this.buildFilters();
      const params = {
        ...filters,
        per_page: '99', // Máximo permitido
        page: '1'
      };

      // Si hay más de 99 tickets, necesitamos hacer múltiples peticiones
      let allTickets: ParkingTicket[] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await firstValueFrom(
          this.ticketService.getHistory({
            ...params,
            page: currentPage.toString()
          })
        );

        if (response?.data) {
          allTickets = [...allTickets, ...response.data];
          
          const totalPages = response.meta?.last_page || 1;
          hasMore = currentPage < totalPages;
          currentPage++;
        } else {
          hasMore = false;
        }
      }

      await this.exportService.exportTicketsReport(
        allTickets,
        `reporte_tickets_${this.reportType}`
      );
      
      this.alertService.showSuccess('Reporte exportado exitosamente');
    } catch {
      this.alertService.showError('Error al exportar reporte');
    } finally {
      this.isExporting.set(false);
    }
  }

  async exportSummary(): Promise<void> {
    try {
      await this.exportService.exportSummaryReport(this.stats, 'resumen_estadisticas');
      this.alertService.showSuccess('Resumen exportado exitosamente');
    } catch {
      this.alertService.showError('Error al exportar resumen');
    }
  }

  formatDate(dateString: string | null | undefined): string {
    return formatDateTime(dateString, '-');
  }

  getTicketStatus(ticket: ParkingTicket): { text: string; class: string } {
    if (ticket.is_active) {
      return { text: 'Activo', class: 'active' };
    }
    
    if (ticket.is_paid) {
      return { text: 'Pagado', class: 'paid' };
    } else {
      return { text: 'Por Pagar', class: 'pending-payment' };
    }
  }

  getPlate(ticket: ParkingTicket): string {
    return ticket.vehicle?.plate || `ID: ${ticket.vehicle_id}`;
  }

  getParkingLotName(ticket: ParkingTicket): string {
    return ticket.parking_lot?.name || `ID: ${ticket.parking_lot_id}`;
  }

  hasActiveFilters(): boolean {
    const value = this.filterForm.value;
    return !!(
      value.date_from ||
      value.date_to ||
      value.plate?.trim() ||
      value.parking_lot_id ||
      value.status
    );
  }

  viewTicketDetail(ticketId: number): void {
    this.router.navigate(['/tickets', ticketId]);
  }
}
