import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of, Subject, Subscription, interval } from 'rxjs';
import { TicketExitPresenter } from '../../presenters/ticket-exit.presenter';
import { TicketStateService } from '../../state/ticket-state.service';
import { TicketPreviewComponent } from '../ticket-preview/ticket-preview.component';
import { ParkingTicket } from '../../../shared/models/parking-ticket.model';
import { PriceCalculation } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-exit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TicketPreviewComponent
  ],
  providers: [TicketExitPresenter],
  templateUrl: './ticket-exit.component.html',
  styleUrl: './ticket-exit.component.scss'
})
export class TicketExitComponent implements OnInit, OnDestroy {
  exitForm: FormGroup;
  foundTicket: ParkingTicket | null = null;
  priceCalculation: PriceCalculation | null = null;
  isSearchingTicket = false;
  isCalculatingPrice = false;
  plateSearchSubject = new Subject<string>();
  private subscriptions = new Subscription();
  private priceUpdateInterval?: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ticketExitPresenter: TicketExitPresenter,
    public ticketState: TicketStateService
  ) {
    this.exitForm = this.fb.group({
      plate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Búsqueda automática de ticket al escribir la placa
    const plateSearchSub = this.plateSearchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(plate => {
        if (plate && plate.length >= 4) {
          this.isSearchingTicket = true;
          this.priceCalculation = null;
          return new Promise<ParkingTicket | null>(resolve => {
            this.ticketExitPresenter.searchTicketByPlate(plate).then(ticket => {
              if (ticket) {
                this.foundTicket = ticket;
                this.calculatePrice();
                this.startPriceUpdateInterval();
              } else {
                this.foundTicket = null;
              }
              resolve(ticket);
            }).catch(() => {
              this.foundTicket = null;
              resolve(null);
            });
          });
        } else {
          this.foundTicket = null;
          this.priceCalculation = null;
          this.stopPriceUpdateInterval();
          return of(null);
        }
      })
    ).subscribe(() => {
      this.isSearchingTicket = false;
    });
    this.subscriptions.add(plateSearchSub);

    // Escuchar cambios en el campo de placa
    const plateSub = this.exitForm.get('plate')?.valueChanges.subscribe(plate => {
      if (plate) {
        this.plateSearchSubject.next(plate.toUpperCase().trim());
      } else {
        this.foundTicket = null;
        this.priceCalculation = null;
        this.stopPriceUpdateInterval();
      }
    });
    if (plateSub) {
      this.subscriptions.add(plateSub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.plateSearchSubject.complete();
    this.stopPriceUpdateInterval();
  }

  get isLoading(): boolean {
    return this.ticketState.loading();
  }

  async calculatePrice(): Promise<void> {
    if (!this.foundTicket?.id) return;

    try {
      this.isCalculatingPrice = true;
      this.priceCalculation = await this.ticketExitPresenter.calculatePrice(this.foundTicket.id);
    } catch (error) {
      console.error('Error calculating price:', error);
    } finally {
      this.isCalculatingPrice = false;
    }
  }

  startPriceUpdateInterval(): void {
    this.stopPriceUpdateInterval();
    // Actualizar precio cada 30 segundos
    this.priceUpdateInterval = interval(30000).subscribe(() => {
      if (this.foundTicket?.id) {
        this.calculatePrice();
      }
    });
  }

  stopPriceUpdateInterval(): void {
    if (this.priceUpdateInterval) {
      this.priceUpdateInterval.unsubscribe();
      this.priceUpdateInterval = undefined;
    }
  }

  async downloadReceiptBeforeExit(): Promise<void> {
    if (!this.foundTicket?.id) return;
    try {
      await this.ticketExitPresenter.downloadReceiptBeforeExit(this.foundTicket.id);
    } catch (error) {
      // Error ya manejado en el presenter
    }
  }

  async confirmExit(): Promise<void> {
    if (!this.exitForm.valid || !this.foundTicket) {
      this.exitForm.markAllAsTouched();
      return;
    }

    try {
      this.stopPriceUpdateInterval();
      await this.ticketExitPresenter.registerExit({
        plate: this.exitForm.get('plate')?.value
      });
    } catch (error) {
      // Error ya manejado en el presenter
    }
  }

  onPlateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const plate = input.value.toUpperCase().trim();
    this.exitForm.get('plate')?.setValue(plate, { emitEvent: true });
  }
}

