import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { DashboardPresenter } from '../../presenters/dashboard.presenter';
import { DashboardStateService } from '../../state/dashboard-state.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ParkingTicket } from '../../../shared/models/parking-ticket.model';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    NgxEchartsDirective,
    LoadingSpinnerComponent
  ],
  providers: [
    DashboardPresenter,
    provideEchartsCore({ echarts: () => import('echarts') })
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {
  displayedColumns: string[] = ['plate', 'entry_time', 'parking_lot', 'spot', 'hours'];
  
  // Chart options
  occupancyChartOption: EChartsOption = {};
  revenueChartOption: EChartsOption = {};

  constructor(
    private dashboardPresenter: DashboardPresenter,
    public dashboardState: DashboardStateService
  ) {
    // Usar effect() para reaccionar a cambios en el Signal
    effect(() => {
      // Leer el signal para que el effect se ejecute cuando cambie
      const stats = this.dashboardState.stats();
      // Actualizar gráficas cuando cambien los datos
      if (stats.totalTickets > 0 || stats.totalRevenue > 0) {
        this.updateCharts();
      }
    });
  }

  ngOnInit(): void {
    this.dashboardPresenter.loadDashboardData();
    // Inicializar gráficas con datos vacíos primero
    this.initializeCharts();
  }

  initializeCharts(): void {
    // Inicializar con datos vacíos
    this.occupancyChartOption = {
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] },
      yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
      series: [{ name: 'Ocupación', type: 'bar', data: [0, 0, 0, 0, 0, 0, 0] }]
    };

    this.revenueChartOption = {
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] },
      yAxis: { type: 'value', axisLabel: { formatter: '${value}' } },
      series: [{ name: 'Ingresos', type: 'line', smooth: true, data: [0, 0, 0, 0, 0, 0, 0] }]
    };
  }

  updateCharts(): void {
    const stats = this.dashboardState.stats();
    
    // Usar datos directamente del endpoint optimizado
    const weekDays = stats.weekDays || ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const weekOccupancy = stats.weekOccupancy || [0, 0, 0, 0, 0, 0, 0];
    const weekRevenue = stats.weekRevenue || [0, 0, 0, 0, 0, 0, 0];
    const totalSpots = stats.totalSpots || 1;
    
    // Calcular porcentajes de ocupación basados en total de espacios
    const occupancyPercentages = weekOccupancy.map(count => 
      totalSpots > 0 ? Math.round((count / totalSpots) * 100) : 0
    );
    
    // Occupancy Chart
    this.occupancyChartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const param = params[0];
          return `${param.name}<br/>${param.seriesName}: ${param.value}%`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: weekDays,
        axisLine: {
          lineStyle: {
            color: '#e2e8f0'
          }
        }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        },
        axisLine: {
          lineStyle: {
            color: '#e2e8f0'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#f1f5f9'
          }
        }
      },
      series: [{
        name: 'Ocupación',
        type: 'bar',
        data: occupancyPercentages,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#6366f1' },
              { offset: 1, color: '#818cf8' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        }
      }]
    };

    // Revenue Chart
    this.revenueChartOption = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const param = params[0];
          return `${param.name}<br/>${param.seriesName}: $${param.value.toFixed(2)}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: weekDays,
        axisLine: {
          lineStyle: {
            color: '#e2e8f0'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '${value}'
        },
        axisLine: {
          lineStyle: {
            color: '#e2e8f0'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#f1f5f9'
          }
        }
      },
      series: [{
        name: 'Ingresos',
        type: 'line',
        smooth: true,
        data: weekRevenue,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(99, 102, 241, 0.3)' },
              { offset: 1, color: 'rgba(99, 102, 241, 0.05)' }
            ]
          }
        },
        lineStyle: {
          color: '#6366f1',
          width: 3
        },
        itemStyle: {
          color: '#6366f1'
        }
      }]
    };
  }


  get stats() {
    return this.dashboardState.stats();
  }

  get activeVehicles() {
    return this.dashboardState.activeVehicles();
  }

  get recentTickets() {
    return this.dashboardState.recentTickets();
  }

  get isLoading() {
    return this.dashboardState.loading();
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString || dateString === 'null' || dateString === '') return '-';
    try {
      // Intentar parsear como ISO primero
      let date = DateTime.fromISO(dateString);
      
      // Si no es válido, intentar otros formatos
      if (!date.isValid) {
        date = DateTime.fromSQL(dateString);
      }
      
      if (!date.isValid) {
        // Intentar formato de Laravel datetime
        date = DateTime.fromFormat(dateString, 'Y-m-d H:i:s');
      }
      
      if (!date.isValid) {
        // Si aún no es válido, devolver el string original truncado
        return dateString.length > 20 ? dateString.substring(0, 20) : dateString;
      }
      
      return date.toLocaleString(DateTime.DATETIME_SHORT);
    } catch (error) {
      console.warn('Error formatting date:', dateString, error);
      return dateString || '-';
    }
  }

  calculateHours(entryTime: string, exitTime: string | null): string {
    try {
      let entry = DateTime.fromISO(entryTime);
      if (!entry.isValid) {
        entry = DateTime.fromSQL(entryTime);
      }
      
      if (!entry.isValid) {
        entry = DateTime.fromFormat(entryTime, 'yyyy-MM-dd HH:mm:ss');
      }
      
      if (!entry.isValid) {
        return '0 minutos';
      }

      let exit: DateTime;
      if (!exitTime) {
        exit = DateTime.now();
      } else {
        exit = DateTime.fromISO(exitTime);
        if (!exit.isValid) {
          exit = DateTime.fromSQL(exitTime);
        }
        if (!exit.isValid) {
          exit = DateTime.fromFormat(exitTime, 'yyyy-MM-dd HH:mm:ss');
        }
      }
      
      if (!exit.isValid) {
        return '0 minutos';
      }

      const diff = exit.diff(entry, ['hours', 'minutes']);
      const totalMinutes = Math.round(diff.as('minutes'));
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      
      if (h === 0) {
        return `${m} ${m === 1 ? 'minuto' : 'minutos'}`;
      } else if (m === 0) {
        return `${h} ${h === 1 ? 'hora' : 'horas'}`;
      } else {
        return `${h} ${h === 1 ? 'hora' : 'horas'} ${m} ${m === 1 ? 'minuto' : 'minutos'}`;
      }
    } catch (error) {
      return '0 minutos';
    }
  }
}

