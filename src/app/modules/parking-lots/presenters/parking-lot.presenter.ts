import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ParkingLotService } from '../services/parking-lot.service';
import { ParkingLotStateService } from '../state/parking-lot-state.service';
import { AlertService } from '../../shared/services/alert.service';
import { ParkingLotFormData } from '../../shared/models/parking-lot.model';

@Injectable()
export class ParkingLotPresenter {
  constructor(
    private parkingLotService: ParkingLotService,
    private parkingLotState: ParkingLotStateService,
    private alertService: AlertService,
    private router: Router
  ) {}

  async loadParkingLots(): Promise<void> {
    try {
      this.parkingLotState.setLoading(true);
      const response = await firstValueFrom(this.parkingLotService.getAll());
      
      if (response?.data) {
        this.parkingLotState.setParkingLots(response.data);
      }
    } catch (error: unknown) {
      this.alertService.showError('Error al cargar estacionamientos');
      console.error('Error loading parking lots:', error);
    } finally {
      this.parkingLotState.setLoading(false);
    }
  }

  async loadParkingLotById(id: number): Promise<void> {
    try {
      this.parkingLotState.setLoading(true);
      const response = await firstValueFrom(this.parkingLotService.getById(id));
      
      if (response?.data) {
        this.parkingLotState.setSelectedLot(response.data);
      }
    } catch (error: unknown) {
      this.alertService.showError('Error al cargar el estacionamiento');
      console.error('Error loading parking lot:', error);
    } finally {
      this.parkingLotState.setLoading(false);
    }
  }

  async createParkingLot(data: ParkingLotFormData): Promise<void> {
    try {
      this.parkingLotState.setLoading(true);
      const response = await firstValueFrom(this.parkingLotService.create(data));
      
      if (response?.data) {
        this.parkingLotState.addParkingLot(response.data);
        this.alertService.showSuccess('Estacionamiento creado exitosamente');
        this.router.navigate(['/parking-lots']);
      }
    } catch (error: unknown) {
      this.alertService.showError('Error al crear el estacionamiento');
      throw error;
    } finally {
      this.parkingLotState.setLoading(false);
    }
  }

  async updateParkingLot(id: number, data: Partial<ParkingLotFormData>): Promise<void> {
    try {
      this.parkingLotState.setLoading(true);
      const response = await firstValueFrom(this.parkingLotService.update(id, data));
      
      if (response?.data) {
        this.parkingLotState.updateParkingLot(response.data);
        this.alertService.showSuccess('Estacionamiento actualizado exitosamente');
        this.router.navigate(['/parking-lots']);
      }
    } catch (error: unknown) {
      this.alertService.showError('Error al actualizar el estacionamiento');
      throw error;
    } finally {
      this.parkingLotState.setLoading(false);
    }
  }
}





