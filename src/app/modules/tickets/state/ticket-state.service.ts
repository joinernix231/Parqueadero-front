import { Injectable, signal } from '@angular/core';
import { ParkingTicket } from '../../shared/models/parking-ticket.model';
import { PaginationState } from '../../shared/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class TicketStateService {
  private _tickets = signal<ParkingTicket[]>([]);
  private _currentTicket = signal<ParkingTicket | null>(null);
  private _loading = signal<boolean>(false);
  private _pagination = signal<PaginationState | null>(null);

  tickets = this._tickets.asReadonly();
  currentTicket = this._currentTicket.asReadonly();
  loading = this._loading.asReadonly();
  pagination = this._pagination.asReadonly();

  setTickets(tickets: ParkingTicket[]): void {
    this._tickets.set(tickets);
  }

  setCurrentTicket(ticket: ParkingTicket | null): void {
    this._currentTicket.set(ticket);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setPagination(pagination: PaginationState | null): void {
    this._pagination.set(pagination);
  }
}





