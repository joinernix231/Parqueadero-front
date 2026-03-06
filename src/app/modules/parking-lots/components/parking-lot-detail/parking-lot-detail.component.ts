import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ParkingLotPresenter } from '../../presenters/parking-lot.presenter';
import { ParkingLotStateService } from '../../state/parking-lot-state.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-parking-lot-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    LoadingSpinnerComponent
  ],
  providers: [ParkingLotPresenter],
  templateUrl: './parking-lot-detail.component.html',
  styleUrl: './parking-lot-detail.component.scss'
})
export class ParkingLotDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private parkingLotPresenter: ParkingLotPresenter,
    public parkingLotState: ParkingLotStateService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.parkingLotPresenter.loadParkingLotById(+id);
    }
  }

  get parkingLot() {
    return this.parkingLotState.selectedLot();
  }

  get isLoading(): boolean {
    return this.parkingLotState.loading();
  }
}





