import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import { Vehicle, VehicleFormData } from '../../shared/models/vehicle.model';
import { PaginatedResponse, ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  constructor(private apiService: ApiService) {}

  getAll(params?: Record<string, any>): Observable<PaginatedResponse<Vehicle>> {
    return this.apiService.getPaginated<Vehicle>('/vehicles', params);
  }

  getById(id: number): Observable<ApiResponse<Vehicle>> {
    return this.apiService.get<Vehicle>(`/vehicles/${id}`);
  }

  findByPlate(plate: string): Observable<ApiResponse<Vehicle>> {
    return this.apiService.get<Vehicle>('/vehicles/search-by-plate', { plate });
  }

  create(data: VehicleFormData): Observable<ApiResponse<Vehicle>> {
    return this.apiService.post<Vehicle>('/vehicles', data);
  }

  update(id: number, data: Partial<VehicleFormData>): Observable<ApiResponse<Vehicle>> {
    return this.apiService.put<Vehicle>(`/vehicles/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`/vehicles/${id}`);
  }
}

