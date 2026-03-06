import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { VehiclePresenter } from '../../presenters/vehicle.presenter';
import { VehicleStateService } from '../../state/vehicle-state.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-vehicle-form',
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
    MatIconModule
  ],
  providers: [VehiclePresenter],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.scss'
})
export class VehicleFormComponent {
  vehicleForm: FormGroup;

  vehicleTypes = [
    { value: 'car', label: 'Automóvil' },
    { value: 'motorcycle', label: 'Motocicleta' },
    { value: 'truck', label: 'Camión' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private vehiclePresenter: VehiclePresenter,
    public vehicleState: VehicleStateService
  ) {
    this.vehicleForm = this.fb.group({
      plate: ['', [Validators.required, Validators.minLength(4)]],
      owner_name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      vehicle_type: ['car', [Validators.required]]
    });
  }

  get isLoading(): boolean {
    return this.vehicleState.loading();
  }

  async onSubmit(): Promise<void> {
    if (this.vehicleForm.valid) {
      try {
        await this.vehiclePresenter.createVehicle(this.vehicleForm.value);
      } catch (error) {
        // Error ya manejado en el presenter
      }
    } else {
      this.vehicleForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/vehicles']);
  }
}

