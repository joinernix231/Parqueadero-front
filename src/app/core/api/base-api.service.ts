import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiClient } from './api-client.service';
import { ApiResponse, PaginatedResponse } from './models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  constructor(private readonly apiClient: ApiClient) {}

  getResponse<T>(endpoint: string, params?: Record<string, unknown>): Observable<ApiResponse<T>> {
    return this.apiClient.get<T>(endpoint, params);
  }

  getData<T>(endpoint: string, params?: Record<string, unknown>): Observable<T> {
    return this.apiClient.get<T>(endpoint, params).pipe(map((response: ApiResponse<T>) => response.data));
  }

  getPaginated<T>(endpoint: string, params?: Record<string, unknown>): Observable<PaginatedResponse<T>> {
    return this.apiClient.getPaginated<T>(endpoint, params);
  }

  postResponse<T>(endpoint: string, payload: unknown): Observable<ApiResponse<T>> {
    return this.apiClient.post<T>(endpoint, payload);
  }

  postData<T>(endpoint: string, payload: unknown): Observable<T> {
    return this.apiClient.post<T>(endpoint, payload).pipe(map((response: ApiResponse<T>) => response.data));
  }

  putResponse<T>(endpoint: string, payload: unknown): Observable<ApiResponse<T>> {
    return this.apiClient.put<T>(endpoint, payload);
  }

  deleteResponse<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.apiClient.delete<T>(endpoint);
  }
}
