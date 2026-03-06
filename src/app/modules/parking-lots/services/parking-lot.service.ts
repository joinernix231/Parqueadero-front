import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import { ParkingLot, ParkingLotFormData } from '../../shared/models/parking-lot.model';
import { PaginatedResponse, ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingLotService {
  constructor(private apiService: ApiService) {}

  getAll(): Observable<ApiResponse<ParkingLot[]>> {
    return this.apiService.get<ParkingLot[]>('/parking-lots');
  }

  getById(id: number): Observable<ApiResponse<ParkingLot>> {
    return this.apiService.get<ParkingLot>(`/parking-lots/${id}`);
  }

  create(data: ParkingLotFormData): Observable<ApiResponse<ParkingLot>> {
    return this.apiService.post<ParkingLot>('/parking-lots', data);
  }

  update(id: number, data: Partial<ParkingLotFormData>): Observable<ApiResponse<ParkingLot>> {
    return this.apiService.put<ParkingLot>(`/parking-lots/${id}`, data);
  }
}





