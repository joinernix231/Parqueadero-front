export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export const DEFAULT_PAGE_SIZE = 15;





