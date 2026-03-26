import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base-api.service';
import { ParkingLot, ParkingLotFormData } from '../../shared/models/parking-lot.model';
import { ApiResponse } from '../../../core/api/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingLotService {
  constructor(private readonly api: BaseApiService) {}

  getAll(): Observable<ApiResponse<ParkingLot[]>> {
    return this.api.getResponse<ParkingLot[]>('/parking-lots');
  }

  getById(id: number): Observable<ApiResponse<ParkingLot>> {
    return this.api.getResponse<ParkingLot>(`/parking-lots/${id}`);
  }

  create(data: ParkingLotFormData): Observable<ApiResponse<ParkingLot>> {
    return this.api.postResponse<ParkingLot>('/parking-lots', data);
  }

  update(id: number, data: Partial<ParkingLotFormData>): Observable<ApiResponse<ParkingLot>> {
    return this.api.putResponse<ParkingLot>(`/parking-lots/${id}`, data);
  }
}





