import { Injectable, signal } from '@angular/core';
import { ParkingTicket } from '../../shared/models/parking-ticket.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardStateService {
  private _activeVehicles = signal<ParkingTicket[]>([]);
  private _recentTickets = signal<ParkingTicket[]>([]);
  private _weekTickets = signal<any[]>([]);
  private _loading = signal<boolean>(false);
  private _stats = signal<{
    activeVehicles: number;
    totalRevenue: number;
    occupancyRate: number;
    totalTickets: number;
    weekTickets?: any[];
    totalSpots?: number;
    weekOccupancy?: number[];
    weekRevenue?: number[];
    weekDays?: string[];
  }>({
    activeVehicles: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    totalTickets: 0,
    weekTickets: [],
    totalSpots: 0,
    weekOccupancy: [],
    weekRevenue: [],
    weekDays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  });

  activeVehicles = this._activeVehicles.asReadonly();
  recentTickets = this._recentTickets.asReadonly();
  weekTickets = this._weekTickets.asReadonly();
  loading = this._loading.asReadonly();
  stats = this._stats.asReadonly();

  setActiveVehicles(vehicles: ParkingTicket[]): void {
    this._activeVehicles.set(vehicles);
  }

  setRecentTickets(tickets: ParkingTicket[]): void {
    this._recentTickets.set(tickets);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  updateStats(stats: {
    activeVehicles: number;
    totalRevenue: number;
    occupancyRate: number;
    totalTickets: number;
    weekTickets?: any[];
    totalSpots?: number;
    weekOccupancy?: number[];
    weekRevenue?: number[];
    weekDays?: string[];
  }): void {
    this._stats.set(stats);
    if (stats.weekTickets) {
      this._weekTickets.set(stats.weekTickets);
    }
  }
}




