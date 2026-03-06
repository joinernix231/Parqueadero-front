import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TicketService } from '../services/ticket.service';
import { TicketStateService } from '../state/ticket-state.service';
import { AlertService } from '../../shared/services/alert.service';
import { PaginationService } from '../../shared/services/pagination.service';
import { ListQueryService } from '../../shared/services/list-query.service';
import { DEFAULT_PAGE_SIZE } from '../../shared/models/pagination.model';
import { CriteriaFilter } from '../../shared/models/list-query.model';

export interface TicketListQuery {
  page?: number;
  search?: string;
  filters?: CriteriaFilter[];
  viewMode?: 'active' | 'history';
}

@Injectable()
export class TicketListPresenter {
  private requestSequence = 0;

  constructor(
    private ticketService: TicketService,
    private ticketState: TicketStateService,
    private alertService: AlertService,
    private paginationService: PaginationService,
    private listQueryService: ListQueryService
  ) {}

  async loadTickets(query: TicketListQuery = {}): Promise<void> {
    const requestId = ++this.requestSequence;
    const viewMode = query.viewMode ?? 'active';

    try {
      this.ticketState.setLoading(true);

      const params = this.listQueryService.buildParams({
        page: query.page ?? 1,
        perPage: DEFAULT_PAGE_SIZE,
        search: query.search,
        filters: query.filters,
        extraParams: { paginate: true }
      });

      // Cargar tickets activos o historial según el modo
      const response = viewMode === 'active'
        ? await firstValueFrom(this.ticketService.getCurrentVehiclesPaginated(params))
        : await firstValueFrom(this.ticketService.getHistory(params));

      if (requestId !== this.requestSequence) {
        return;
      }

      if (response?.data && response.meta) {
        this.ticketState.setTickets(response.data);
        this.ticketState.setPagination(this.paginationService.createPaginationState(response.meta));
      }
    } catch (error: unknown) {
      if (requestId !== this.requestSequence) {
        return;
      }

      this.ticketState.setTickets([]);
      this.ticketState.setPagination(null);
      this.alertService.showError('Error al cargar los tickets');
      console.error('Error loading tickets:', error);
    } finally {
      if (requestId === this.requestSequence) {
        this.ticketState.setLoading(false);
      }
    }
  }
}

