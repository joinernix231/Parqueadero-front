import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ParkingSpaceService } from '../services/parking-space.service';
import { ParkingSpaceStateService } from '../state/parking-space-state.service';
import { AlertService } from '../../shared/services/alert.service';

@Injectable()
export class ParkingSpacePresenter {
  constructor(
    private parkingSpaceService: ParkingSpaceService,
    private parkingSpaceState: ParkingSpaceStateService,
    private alertService: AlertService
  ) {}

  async loadAvailableSpots(parkingLotId: number): Promise<void> {
    try {
      this.parkingSpaceState.setLoading(true);
      this.parkingSpaceState.setSelectedLotId(parkingLotId);
      
      const response = await firstValueFrom(this.parkingSpaceService.getAvailableSpots(parkingLotId));
      
      if (response?.data) {
        this.parkingSpaceState.setAvailableSpots(response.data);
      }
    } catch (error: unknown) {
      this.alertService.showError('Error al cargar espacios disponibles');
      console.error('Error loading available spots:', error);
    } finally {
      this.parkingSpaceState.setLoading(false);
    }
  }
}





