import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base-api.service';
import { ParkingSpot } from '../../shared/models/parking-spot.model';
import { ApiResponse } from '../../../core/api/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingSpaceService {
  constructor(private readonly api: BaseApiService) {}

  getAvailableSpots(parkingLotId: number): Observable<ApiResponse<ParkingSpot[]>> {
    return this.api.getResponse<ParkingSpot[]>('/parking-spots/available', {
      parking_lot_id: parkingLotId
    });
  }
}





