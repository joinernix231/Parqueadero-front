import { Injectable, signal } from '@angular/core';
import { ParkingLot } from '../../shared/models/parking-lot.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingLotStateService {
  private _parkingLots = signal<ParkingLot[]>([]);
  private _selectedLot = signal<ParkingLot | null>(null);
  private _loading = signal<boolean>(false);

  parkingLots = this._parkingLots.asReadonly();
  selectedLot = this._selectedLot.asReadonly();
  loading = this._loading.asReadonly();

  setParkingLots(lots: ParkingLot[]): void {
    this._parkingLots.set(lots);
  }

  setSelectedLot(lot: ParkingLot | null): void {
    this._selectedLot.set(lot);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  addParkingLot(lot: ParkingLot): void {
    this._parkingLots.update(lots => [...lots, lot]);
  }

  updateParkingLot(lot: ParkingLot): void {
    this._parkingLots.update(lots =>
      lots.map(l => l.id === lot.id ? lot : l)
    );
  }

  removeParkingLot(id: number): void {
    this._parkingLots.update(lots => lots.filter(l => l.id !== id));
  }
}





