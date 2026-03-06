import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th *ngFor="let column of columns" 
                [class.sortable]="column.sortable"
                (click)="column.sortable && onSort(column.key)">
              {{ column.label }}
              <span *ngIf="column.sortable && sortColumn === column.key" class="sort-icon">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th *ngIf="actionsTemplate">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data; trackBy: trackByFn">
            <td *ngFor="let column of columns">
              <ng-container *ngIf="!cellTemplates[column.key]; else customCell">
                {{ getCellValue(row, column.key) }}
              </ng-container>
              <ng-template #customCell>
                <ng-container *ngTemplateOutlet="cellTemplates[column.key]; context: { $implicit: row }"></ng-container>
              </ng-template>
            </td>
            <td *ngIf="actionsTemplate">
              <ng-container *ngTemplateOutlet="actionsTemplate; context: { $implicit: row }"></ng-container>
            </td>
          </tr>
          <tr *ngIf="data.length === 0">
            <td [attr.colspan]="columns.length + (actionsTemplate ? 1 : 0)" class="empty-state">
              No hay datos disponibles
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-container {
      overflow-x: auto;
      background: white;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background-color: #424242;
    }

    th {
      padding: 1rem 1.25rem;
      text-align: left;
      font-weight: 600;
      color: white;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: none;
      
      &.sortable {
        cursor: pointer;
        user-select: none;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }

    .sort-icon {
      margin-left: 0.5rem;
      font-size: 0.875rem;
    }

    tbody tr {
      transition: background-color 0.2s ease;
      border-bottom: 1px solid #e0e0e0;
      background-color: white;

      &:nth-child(even) {
        background-color: #fafafa;
      }

      &:hover {
        background-color: #f5f5f5 !important;
      }

      &:last-child {
        border-bottom: none;
      }
    }

    td {
      padding: 1rem 1.25rem;
      color: #212121;
      font-size: 0.9375rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #757575;
      font-style: italic;
      font-size: 1rem;
    }
  `]
})
export class TableComponent<T = any> {
  @Input() columns: TableColumn[] = [];
  @Input() data: T[] = [];
  @Input() cellTemplates: Record<string, TemplateRef<any>> = {};
  @Input() actionsTemplate?: TemplateRef<any>;
  @Output() sortChange = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();

  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  trackByFn(index: number, item: T): any {
    return (item as any).id || index;
  }

  getCellValue(row: T, key: string): any {
    const value = (row as any)[key];
    // Si el valor es null o undefined, retornar 'N/A'
    if (value === null || value === undefined) {
      return 'N/A';
    }
    return value;
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.sortChange.emit({ column: this.sortColumn, direction: this.sortDirection });
  }
}

