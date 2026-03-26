import { Injectable } from '@angular/core';
import { PaginationState, DEFAULT_PAGE_SIZE } from '../models/pagination.model';
import { PaginationMeta } from '../../../core/api/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  createPaginationState(meta: PaginationMeta): PaginationState {
    return {
      currentPage: meta.current_page,
      itemsPerPage: meta.per_page,
      totalItems: meta.total,
      totalPages: meta.last_page
    };
  }

  getPageParams(page: number, perPage: number = DEFAULT_PAGE_SIZE): Record<string, any> {
    return {
      page: page.toString(),
      per_page: perPage.toString()
    };
  }

  calculateTotalPages(totalItems: number, itemsPerPage: number): number {
    return Math.ceil(totalItems / itemsPerPage);
  }

  getPageNumbers(currentPage: number, totalPages: number, maxPages: number = 5): number[] {
    const pages: number[] = [];
    const half = Math.floor(maxPages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxPages - 1);

    if (end - start < maxPages - 1) {
      start = Math.max(1, end - maxPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}





