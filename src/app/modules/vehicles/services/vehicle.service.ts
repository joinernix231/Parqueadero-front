import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base-api.service';
import { Vehicle, VehicleFormData } from '../../shared/models/vehicle.model';
import { PaginatedResponse, ApiResponse } from '../../../core/api/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  constructor(private readonly api: BaseApiService) {}

  getAll(params?: Record<string, any>): Observable<PaginatedResponse<Vehicle>> {
    return this.api.getPaginated<Vehicle>('/vehicles', params);
  }

  getById(id: number): Observable<ApiResponse<Vehicle>> {
    return this.api.getResponse<Vehicle>(`/vehicles/${id}`);
  }

  findByPlate(plate: string): Observable<ApiResponse<Vehicle>> {
    return this.api.getResponse<Vehicle>('/vehicles/search-by-plate', { plate });
  }

  create(data: VehicleFormData): Observable<ApiResponse<Vehicle>> {
    return this.api.postResponse<Vehicle>('/vehicles', data);
  }

  update(id: number, data: Partial<VehicleFormData>): Observable<ApiResponse<Vehicle>> {
    return this.api.putResponse<Vehicle>(`/vehicles/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.api.deleteResponse<void>(`/vehicles/${id}`);
  }
}

