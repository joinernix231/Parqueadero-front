import { Injectable, signal } from '@angular/core';
import { Vehicle } from '../../shared/models/vehicle.model';
import { PaginationState } from '../../shared/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleStateService {
  private _vehicles = signal<Vehicle[]>([]);
  private _selectedVehicle = signal<Vehicle | null>(null);
  private _loading = signal<boolean>(false);
  private _pagination = signal<PaginationState | null>(null);

  vehicles = this._vehicles.asReadonly();
  selectedVehicle = this._selectedVehicle.asReadonly();
  loading = this._loading.asReadonly();
  pagination = this._pagination.asReadonly();

  setVehicles(vehicles: Vehicle[]): void {
    this._vehicles.set(vehicles);
  }

  setSelectedVehicle(vehicle: Vehicle | null): void {
    this._selectedVehicle.set(vehicle);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setPagination(pagination: PaginationState | null): void {
    this._pagination.set(pagination);
  }

  addVehicle(vehicle: Vehicle): void {
    this._vehicles.update(vehicles => [...vehicles, vehicle]);
  }

  updateVehicle(vehicle: Vehicle): void {
    this._vehicles.update(vehicles =>
      vehicles.map(v => v.id === vehicle.id ? vehicle : v)
    );
  }

  removeVehicle(id: number): void {
    this._vehicles.update(vehicles => vehicles.filter(v => v.id !== id));
  }
}





