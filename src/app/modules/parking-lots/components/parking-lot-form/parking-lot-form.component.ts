import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ParkingLotPresenter } from '../../presenters/parking-lot.presenter';
import { ParkingLotStateService } from '../../state/parking-lot-state.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-parking-lot-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    LoadingSpinnerComponent
  ],
  providers: [ParkingLotPresenter],
  templateUrl: './parking-lot-form.component.html',
  styleUrl: './parking-lot-form.component.scss'
})
export class ParkingLotFormComponent implements OnInit {
  parkingLotForm: FormGroup;
  isEditMode = false;
  parkingLotId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private parkingLotPresenter: ParkingLotPresenter,
    public parkingLotState: ParkingLotStateService
  ) {
    this.parkingLotForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required]],
      total_spots: [0, [Validators.required, Validators.min(1)]],
      hourly_rate_day: [0, [Validators.required, Validators.min(0)]],
      hourly_rate_night: [0, [Validators.required, Validators.min(0)]],
      day_start_time: ['06:00', [Validators.required]],
      day_end_time: ['20:00', [Validators.required]],
      is_active: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.parkingLotId = +id;
      this.loadParkingLot();
    }
  }

  async loadParkingLot(): Promise<void> {
    if (this.parkingLotId) {
      await this.parkingLotPresenter.loadParkingLotById(this.parkingLotId);
      const lot = this.parkingLotState.selectedLot();
      if (lot) {
        this.parkingLotForm.patchValue({
          name: lot.name,
          address: lot.address,
          total_spots: lot.total_spots,
          hourly_rate_day: lot.hourly_rate_day,
          hourly_rate_night: lot.hourly_rate_night,
          day_start_time: lot.day_start_time,
          day_end_time: lot.day_end_time,
          is_active: lot.is_active
        });
      }
    }
  }

  get isLoading(): boolean {
    return this.parkingLotState.loading();
  }

  async onSubmit(): Promise<void> {
    if (this.parkingLotForm.valid) {
      try {
        if (this.isEditMode && this.parkingLotId) {
          await this.parkingLotPresenter.updateParkingLot(this.parkingLotId, this.parkingLotForm.value);
        } else {
          await this.parkingLotPresenter.createParkingLot(this.parkingLotForm.value);
        }
      } catch (error) {
        // Error ya manejado en el presenter
      }
    } else {
      this.parkingLotForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/parking-lots']);
  }
}





