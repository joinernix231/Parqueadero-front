import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertDialogComponent, AlertDialogData } from '../components/alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private dialog: MatDialog) {}

  showSuccess(message: string, title: string = '¡Éxito!'): void {
    this.openDialog({
      type: 'success',
      title: title,
      message: message
    });
  }

  showError(message: string, title: string = '¡Error!'): void {
    this.openDialog({
      type: 'error',
      title: title,
      message: message
    });
  }

  showWarning(message: string, title: string = '¡Advertencia!'): void {
    this.openDialog({
      type: 'warning',
      title: title,
      message: message
    });
  }

  showInfo(message: string, title: string = 'Información'): void {
    this.openDialog({
      type: 'info',
      title: title,
      message: message
    });
  }

  private openDialog(data: AlertDialogData): void {
    const config: MatDialogConfig = {
      data: data,
      disableClose: false,
      panelClass: 'alert-dialog-backdrop',
      maxWidth: '500px',
      width: '90%'
    };

    this.dialog.open(AlertDialogComponent, config);
  }
}




