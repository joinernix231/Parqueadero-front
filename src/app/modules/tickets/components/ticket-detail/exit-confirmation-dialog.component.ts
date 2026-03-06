import { Component, Inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PriceCalculation } from '../../services/ticket.service';

export interface ExitConfirmationDialogData {
  vehicle?: {
    plate?: string;
    owner_name?: string;
  };
  calculatedPrice?: PriceCalculation;
}

@Component({
  selector: 'app-exit-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [DecimalPipe],
  template: `
    <div class="confirmation-dialog">
      <div class="icon-section">
        <mat-icon class="warning-icon">warning</mat-icon>
      </div>
      <h2 class="dialog-title">Confirmar Salida</h2>
      <p class="dialog-message">
        ¿Estás seguro de que deseas registrar la salida del vehículo?
      </p>
      <div class="ticket-info" *ngIf="data">
        <div class="info-row">
          <span class="info-label">Vehículo:</span>
          <span class="info-value">{{ data.vehicle?.plate }} - {{ data.vehicle?.owner_name }}</span>
        </div>
        <div class="info-row" *ngIf="data.calculatedPrice">
          <span class="info-label">Monto a pagar:</span>
          <span class="info-value amount">&#36;{{ data.calculatedPrice.total_amount | number:'1.2-2' }}</span>
        </div>
      </div>
      <div class="dialog-actions">
        <button mat-stroked-button (click)="onCancel()" class="cancel-btn">
          Cancelar
        </button>
        <button mat-raised-button color="warn" (click)="onConfirm()" class="confirm-btn">
          <mat-icon>exit_to_app</mat-icon>
          Confirmar Salida
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-dialog {
      padding: 2rem;
      text-align: center;
      min-width: 400px;
    }

    .icon-section {
      margin-bottom: 1.5rem;
    }

    .warning-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ff9800;
    }

    .dialog-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      color: #212121;
    }

    .dialog-message {
      font-size: 1rem;
      color: #757575;
      margin: 0 0 1.5rem 0;
      line-height: 1.6;
    }

    .ticket-info {
      background: #f5f5f5;
      border-radius: 0.5rem;
      padding: 1rem;
      margin: 1.5rem 0;
      text-align: left;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .info-label {
      font-weight: 600;
      color: #757575;
    }

    .info-value {
      color: #212121;
      font-weight: 500;

      &.amount {
        font-size: 1.25rem;
        font-weight: 700;
        color: #4caf50;
      }
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .cancel-btn,
    .confirm-btn {
      padding: 0.75rem 1.5rem;
      font-weight: 600;
    }

    .confirm-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class ExitConfirmationDialogComponent {
  data: ExitConfirmationDialogData;

  constructor(
    public dialogRef: MatDialogRef<ExitConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) dialogData: ExitConfirmationDialogData
  ) {
    this.data = dialogData;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}

