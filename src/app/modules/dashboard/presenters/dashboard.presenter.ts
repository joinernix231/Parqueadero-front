import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DashboardService } from '../services/dashboard.service';
import { DashboardStateService } from '../state/dashboard-state.service';
import { AlertService } from '../../shared/services/alert.service';

@Injectable()
export class DashboardPresenter {
  constructor(
    private dashboardService: DashboardService,
    private dashboardState: DashboardStateService,
    private alertService: AlertService
  ) {}

  async loadDashboardData(): Promise<void> {
    try {
      this.dashboardState.setLoading(true);

      // Usar el endpoint optimizado que devuelve solo estadísticas
      // getRecentTickets solo carga 10 tickets para la tabla de actividad reciente
      const [dashboardStats, currentVehicles, recentTickets] = await Promise.all([
        firstValueFrom(this.dashboardService.getDashboardStats()),
        firstValueFrom(this.dashboardService.getCurrentParkedVehicles()),
        firstValueFrom(this.dashboardService.getRecentTickets(10)) // Máximo 10, nunca supera 99
      ]);

      if (currentVehicles?.data) {
        this.dashboardState.setActiveVehicles(currentVehicles.data);
      }

      if (recentTickets?.data) {
        this.dashboardState.setRecentTickets(recentTickets.data);
      }

      // Usar estadísticas del endpoint optimizado
      if (dashboardStats?.data) {
        const stats = dashboardStats.data;
        
        this.dashboardState.updateStats({
          activeVehicles: stats.active_vehicles,
          totalRevenue: stats.total_revenue,
          occupancyRate: stats.occupancy_rate,
          totalTickets: stats.total_tickets,
          weekTickets: [], // Ya no necesitamos cargar tickets para las gráficas
          totalSpots: stats.total_spots,
          weekOccupancy: stats.week_occupancy,
          weekRevenue: stats.week_revenue,
          weekDays: stats.week_days
        });
      }
    } catch {
      this.alertService.showError('Error al cargar datos del dashboard');
    } finally {
      this.dashboardState.setLoading(false);
    }
  }

}




