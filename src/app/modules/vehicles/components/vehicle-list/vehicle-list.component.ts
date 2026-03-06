import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { VehiclePresenter } from '../../presenters/vehicle.presenter';
import { VehicleStateService } from '../../state/vehicle-state.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    LoadingSpinnerComponent,
    PaginationComponent
  ],
  providers: [VehiclePresenter],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss'
})
export class VehicleListComponent implements OnInit {
  searchForm: FormGroup;
  displayedColumns: string[] = ['plate', 'owner_name', 'phone', 'vehicle_type', 'actions'];

  constructor(
    private fb: FormBuilder,
    private vehiclePresenter: VehiclePresenter,
    public vehicleState: VehicleStateService
  ) {
    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  ngOnInit(): void {
    this.vehiclePresenter.loadVehicles();
  }

  get vehicles() {
    return this.vehicleState.vehicles();
  }

  get isLoading() {
    return this.vehicleState.loading();
  }

  get pagination() {
    return this.vehicleState.pagination();
  }

  onSearch(): void {
    const search = this.searchForm.get('search')?.value;
    this.vehiclePresenter.loadVehicles(1, search || undefined);
  }

  onPageChange(page: number): void {
    const search = this.searchForm.get('search')?.value;
    this.vehiclePresenter.loadVehicles(page, search || undefined);
  }
}




