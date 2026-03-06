import { Injectable, signal } from '@angular/core';
import { ParkingSpot } from '../../shared/models/parking-spot.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingSpaceStateService {
  private _availableSpots = signal<ParkingSpot[]>([]);
  private _selectedSpot = signal<ParkingSpot | null>(null);
  private _loading = signal<boolean>(false);
  private _selectedLotId = signal<number | null>(null);

  availableSpots = this._availableSpots.asReadonly();
  selectedSpot = this._selectedSpot.asReadonly();
  loading = this._loading.asReadonly();
  selectedLotId = this._selectedLotId.asReadonly();

  setAvailableSpots(spots: ParkingSpot[]): void {
    this._availableSpots.set(spots);
  }

  setSelectedSpot(spot: ParkingSpot | null): void {
    this._selectedSpot.set(spot);
  }

  setSelectedLotId(lotId: number | null): void {
    this._selectedLotId.set(lotId);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }
}





