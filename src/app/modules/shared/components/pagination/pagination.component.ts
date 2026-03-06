import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationState } from '../../models/pagination.model';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav *ngIf="pagination && pagination.totalPages > 1" class="pagination-container">
      <ul class="pagination">
        <li class="page-item" [class.disabled]="pagination.currentPage === 1">
          <a class="page-link" (click)="goToPage(pagination.currentPage - 1)" [attr.aria-label]="'Anterior'">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        
        <li *ngFor="let page of pageNumbers" 
            class="page-item" 
            [class.active]="page === pagination.currentPage">
          <a class="page-link" (click)="goToPage(page)">{{ page }}</a>
        </li>
        
        <li class="page-item" [class.disabled]="pagination.currentPage === pagination.totalPages">
          <a class="page-link" (click)="goToPage(pagination.currentPage + 1)" [attr.aria-label]="'Siguiente'">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
      
      <div class="pagination-info">
        Mostrando {{ startItem }} - {{ endItem }} de {{ pagination.totalItems }} resultados
      </div>
    </nav>
  `,
  styles: [`
    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .pagination {
      display: flex;
      list-style: none;
      padding: 0;
      margin: 0;
      gap: 0.25rem;
    }

    .page-item {
      &.disabled .page-link {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      &.active .page-link {
        background-color: var(--primary-color, #1976d2);
        color: white;
        border-color: var(--primary-color, #1976d2);
      }
    }

    .page-link {
      display: block;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 0.25rem;
      color: var(--text-primary, #212121);
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;

      &:hover:not(.disabled) {
        background-color: var(--background-secondary, #f5f5f5);
        border-color: var(--primary-color, #1976d2);
      }
    }

    .pagination-info {
      color: var(--text-secondary, #757575);
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .pagination-container {
        flex-direction: column;
      }
    }
  `]
})
export class PaginationComponent {
  @Input() pagination?: PaginationState | null;
  @Output() pageChange = new EventEmitter<number>();

  get pageNumbers(): number[] {
    if (!this.pagination) return [];
    
    const maxPages = 5;
    const currentPage = this.pagination.currentPage;
    const totalPages = this.pagination.totalPages;
    const half = Math.floor(maxPages / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxPages - 1);
    
    if (end - start < maxPages - 1) {
      start = Math.max(1, end - maxPages + 1);
    }
    
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  get startItem(): number {
    if (!this.pagination) return 0;
    return (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + 1;
  }

  get endItem(): number {
    if (!this.pagination) return 0;
    return Math.min(
      this.pagination.currentPage * this.pagination.itemsPerPage,
      this.pagination.totalItems
    );
  }

  goToPage(page: number): void {
    if (!this.pagination) return;
    
    if (page >= 1 && page <= this.pagination.totalPages && page !== this.pagination.currentPage) {
      this.pageChange.emit(page);
    }
  }
}





