import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import { ParkingSpot } from '../../shared/models/parking-spot.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingSpaceService {
  constructor(private apiService: ApiService) {}

  getAvailableSpots(parkingLotId: number): Observable<ApiResponse<ParkingSpot[]>> {
    return this.apiService.get<ParkingSpot[]>('/parking-spots/available', {
      parking_lot_id: parkingLotId
    });
  }
}





