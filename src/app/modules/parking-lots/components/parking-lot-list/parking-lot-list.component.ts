import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ParkingLotPresenter } from '../../presenters/parking-lot.presenter';
import { ParkingLotStateService } from '../../state/parking-lot-state.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ParkingLot } from '../../../shared/models/parking-lot.model';

@Component({
  selector: 'app-parking-lot-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    LoadingSpinnerComponent
  ],
  providers: [ParkingLotPresenter],
  templateUrl: './parking-lot-list.component.html',
  styleUrl: './parking-lot-list.component.scss'
})
export class ParkingLotListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'address', 'total_spots', 'rates', 'status', 'actions'];

  constructor(
    private parkingLotPresenter: ParkingLotPresenter,
    public parkingLotState: ParkingLotStateService
  ) {}

  ngOnInit(): void {
    this.parkingLotPresenter.loadParkingLots();
  }

  get parkingLots(): ParkingLot[] {
    return this.parkingLotState.parkingLots();
  }

  get isLoading(): boolean {
    return this.parkingLotState.loading();
  }
}

