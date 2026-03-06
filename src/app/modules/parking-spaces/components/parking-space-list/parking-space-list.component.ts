import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Subscription } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { ParkingSpacePresenter } from '../../presenters/parking-space.presenter';
import { ParkingSpaceStateService } from '../../state/parking-space-state.service';
import { ParkingLotService } from '../../../parking-lots/services/parking-lot.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ParkingSpot } from '../../../shared/models/parking-spot.model';
import { ParkingLot } from '../../../shared/models/parking-lot.model';

@Component({
  selector: 'app-parking-space-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    LoadingSpinnerComponent
  ],
  providers: [ParkingSpacePresenter],
  templateUrl: './parking-space-list.component.html',
  styleUrl: './parking-space-list.component.scss'
})
export class ParkingSpaceListComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  parkingLots: ParkingLot[] = [];
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private parkingSpacePresenter: ParkingSpacePresenter,
    public parkingSpaceState: ParkingSpaceStateService,
    private parkingLotService: ParkingLotService
  ) {
    this.filterForm = this.fb.group({
      parking_lot_id: [null]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadParkingLots();
    const lotIdSub = this.filterForm.get('parking_lot_id')?.valueChanges.subscribe(lotId => {
      if (lotId) {
        this.parkingSpacePresenter.loadAvailableSpots(lotId);
      }
    });
    if (lotIdSub) {
      this.subscriptions.add(lotIdSub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async loadParkingLots(): Promise<void> {
    try {
      const response = await firstValueFrom(this.parkingLotService.getAll());
      if (response?.data) {
        this.parkingLots = response.data;
      }
    } catch (error) {
      console.error('Error loading parking lots:', error);
    }
  }

  get availableSpots(): ParkingSpot[] {
    return this.parkingSpaceState.availableSpots();
  }

  get isLoading(): boolean {
    return this.parkingSpaceState.loading();
  }

  onRefresh(): void {
    const lotId = this.filterForm.get('parking_lot_id')?.value;
    if (lotId) {
      this.parkingSpacePresenter.loadAvailableSpots(lotId);
    }
  }
}

