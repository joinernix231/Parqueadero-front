import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of, Subject, Subscription } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { TicketEntryPresenter } from '../../presenters/ticket-entry.presenter';
import { TicketStateService } from '../../state/ticket-state.service';
import { ParkingLotService } from '../../../parking-lots/services/parking-lot.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { ParkingSpaceService } from '../../../parking-spaces/services/parking-space.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ParkingLot } from '../../../shared/models/parking-lot.model';
import { ParkingSpot } from '../../../shared/models/parking-spot.model';
import { Vehicle } from '../../../shared/models/vehicle.model';

@Component({
  selector: 'app-ticket-entry',
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
    MatIconModule,
    MatExpansionModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  providers: [TicketEntryPresenter],
  templateUrl: './ticket-entry.component.html',
  styleUrl: './ticket-entry.component.scss'
})
export class TicketEntryComponent implements OnInit, OnDestroy {
  entryForm: FormGroup;
  vehicleForm: FormGroup;
  parkingLots: ParkingLot[] = [];
  availableSpots: ParkingSpot[] = [];
  
  foundVehicle: Vehicle | null = null;
  isSearchingVehicle = false;
  showVehicleForm = false;
  plateSearchSubject = new Subject<string>();
  private subscriptions = new Subscription();

  vehicleTypes = [
    { value: 'car', label: 'Automóvil' },
    { value: 'motorcycle', label: 'Motocicleta' },
    { value: 'truck', label: 'Camión' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ticketEntryPresenter: TicketEntryPresenter,
    public ticketState: TicketStateService,
    private parkingLotService: ParkingLotService,
    private vehicleService: VehicleService,
    private parkingSpaceService: ParkingSpaceService,
    private alertService: AlertService
  ) {
    this.entryForm = this.fb.group({
      plate: ['', Validators.required],
      parking_lot_id: ['', Validators.required],
      parking_spot_id: [{value: '', disabled: true}, Validators.required]
    });

    this.vehicleForm = this.fb.group({
      owner_name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      vehicle_type: ['car', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadParkingLots();
    
    const lotIdSub = this.entryForm.get('parking_lot_id')?.valueChanges.subscribe(lotId => {
      if (lotId) {
        this.loadAvailableSpots(lotId);
        this.entryForm.get('parking_spot_id')?.enable();
      } else {
        this.availableSpots = [];
        this.entryForm.get('parking_spot_id')?.setValue('');
        this.entryForm.get('parking_spot_id')?.disable();
      }
    });
    if (lotIdSub) {
      this.subscriptions.add(lotIdSub);
    }

    // Búsqueda automática de vehículo al escribir la placa
    const plateSearchSub = this.plateSearchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(plate => {
        if (plate && plate.length >= 4) {
          this.isSearchingVehicle = true;
          return this.vehicleService.findByPlate(plate).pipe(
            catchError(() => {
              this.foundVehicle = null;
              this.showVehicleForm = true;
              return of(null);
            })
          );
        } else {
          this.foundVehicle = null;
          this.showVehicleForm = false;
          return of(null);
        }
      })
    ).subscribe(response => {
      this.isSearchingVehicle = false;
      if (response?.data) {
        this.foundVehicle = response.data;
        this.showVehicleForm = false;
        // Pre-llenar datos del vehículo encontrado
        this.vehicleForm.patchValue({
          owner_name: this.foundVehicle.owner_name,
          phone: this.foundVehicle.phone,
          vehicle_type: this.foundVehicle.vehicle_type
        });
      } else {
        this.foundVehicle = null;
        const plate = this.entryForm.get('plate')?.value;
        if (plate && plate.length >= 4) {
          this.showVehicleForm = true;
        }
      }
    });
    this.subscriptions.add(plateSearchSub);

    // Escuchar cambios en el campo de placa
    const plateSub = this.entryForm.get('plate')?.valueChanges.subscribe(plate => {
      if (plate) {
        this.plateSearchSubject.next(plate.toUpperCase().trim());
      } else {
        this.foundVehicle = null;
        this.showVehicleForm = false;
      }
    });
    if (plateSub) {
      this.subscriptions.add(plateSub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.plateSearchSubject.complete();
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

  async loadAvailableSpots(lotId: number): Promise<void> {
    try {
      const response = await firstValueFrom(this.parkingSpaceService.getAvailableSpots(lotId));
      if (response?.data) {
        this.availableSpots = response.data.filter((spot: ParkingSpot) => spot.is_available);
      }
    } catch (error) {
      console.error('Error loading available spots:', error);
    }
  }

  get isLoading(): boolean {
    return this.ticketState.loading();
  }

  async onSubmit(): Promise<void> {
    if (this.entryForm.valid) {
      const formData: any = {
        parking_lot_id: this.entryForm.get('parking_lot_id')?.value,
        parking_spot_id: this.entryForm.get('parking_spot_id')?.value,
        entry_time: new Date().toISOString()
      };
      
      // Si el vehículo no fue encontrado, incluir los datos del formulario
      if (!this.foundVehicle && this.showVehicleForm) {
        if (this.vehicleForm.valid) {
          const plate = this.entryForm.get('plate')?.value?.toUpperCase().trim();
          formData.vehicle_data = {
            plate: plate,
            owner_name: this.vehicleForm.get('owner_name')?.value,
            phone: this.vehicleForm.get('phone')?.value,
            vehicle_type: this.vehicleForm.get('vehicle_type')?.value
          };
        } else {
          this.vehicleForm.markAllAsTouched();
          return;
        }
      } else if (this.foundVehicle) {
        // Si el vehículo existe, usar su ID
        formData.vehicle_id = this.foundVehicle.id;
      } else {
        this.alertService.showError('Debe buscar o registrar un vehículo.');
        return;
      }

      try {
        await this.ticketEntryPresenter.registerEntry(formData);
        // El presenter ya muestra el mensaje de éxito y navega
        // Solo limpiamos el formulario si todo fue exitoso
        this.entryForm.reset();
        this.vehicleForm.reset();
        this.foundVehicle = null;
        this.showVehicleForm = false;
        this.entryForm.get('parking_spot_id')?.disable();
      } catch (error) {
        // El interceptor ya maneja y muestra los errores HTTP del backend
        // No necesitamos hacer nada aquí
      }
    } else {
      this.entryForm.markAllAsTouched();
      if (this.showVehicleForm) {
        this.vehicleForm.markAllAsTouched();
      }
    }
  }

  onPlateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const plate = input.value.toUpperCase().trim();
    this.entryForm.get('plate')?.setValue(plate, { emitEvent: true });
  }
}

