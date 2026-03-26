import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { VehicleService } from '../services/vehicle.service';
import { VehicleStateService } from '../state/vehicle-state.service';
import { AlertService } from '../../shared/services/alert.service';
import { PaginationService } from '../../shared/services/pagination.service';
import { ListQueryService } from '../../shared/services/list-query.service';
import { VehicleFormData } from '../../shared/models/vehicle.model';
import { DEFAULT_PAGE_SIZE } from '../../shared/models/pagination.model';

@Injectable()
export class VehiclePresenter {
  constructor(
    private vehicleService: VehicleService,
    private vehicleState: VehicleStateService,
    private alertService: AlertService,
    private paginationService: PaginationService,
    private listQueryService: ListQueryService,
    private router: Router
  ) {}

  async loadVehicles(page: number = 1, search?: string): Promise<void> {
    try {
      this.vehicleState.setLoading(true);
      const params = this.listQueryService.buildParams({
        page,
        perPage: DEFAULT_PAGE_SIZE,
        filters: search ? [{ field: 'plate', operator: 'like', value: search }] : []
      });
      
      const response = await firstValueFrom(this.vehicleService.getAll(params));
      
      if (response?.data && response.meta) {
        this.vehicleState.setVehicles(response.data);
        this.vehicleState.setPagination(this.paginationService.createPaginationState(response.meta));
      }
    } catch (error: unknown) {
      // El interceptor ya se encarga de mostrar errores HTTP.
    } finally {
      this.vehicleState.setLoading(false);
    }
  }

  async createVehicle(data: VehicleFormData): Promise<void> {
    try {
      this.vehicleState.setLoading(true);
      const response = await firstValueFrom(this.vehicleService.create(data));
      
      if (response?.data) {
        this.vehicleState.addVehicle(response.data);
        this.alertService.showSuccess('Vehículo registrado exitosamente');
        this.router.navigate(['/vehicles']);
      }
    } catch (error: unknown) {
      // El interceptor ya se encarga de mostrar errores HTTP.
      throw error;
    } finally {
      this.vehicleState.setLoading(false);
    }
  }
}




