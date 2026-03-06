import { Injectable } from '@angular/core';
import { CriteriaFilter, ListQueryOptions, QueryParamValue } from '../models/list-query.model';

@Injectable({
  providedIn: 'root'
})
export class ListQueryService {
  buildParams(options: ListQueryOptions = {}): Record<string, string> {
    const params: Record<string, string> = {};

    if (options.page) {
      params['page'] = options.page.toString();
    }

    if (options.perPage) {
      params['per_page'] = options.perPage.toString();
    }

    const search = options.search?.trim();
    if (search) {
      params['search'] = search;
    }

    const serializedFilters = this.serializeFilters(options.filters ?? []);
    if (serializedFilters) {
      params['filters'] = serializedFilters;
    }

    Object.entries(options.extraParams ?? {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params[key] = value.toString();
      }
    });

    return params;
  }

  serializeFilters(filters: CriteriaFilter[]): string {
    return filters
      .filter(filter => !!filter.field)
      .map(filter => {
        const operator = filter.operator ?? 'eq';
        const value = this.serializeValue(filter.value);
        return `${filter.field}|${operator}|${value}`;
      })
      .join(';');
  }

  private serializeValue(value?: QueryParamValue | QueryParamValue[]): string {
    if (Array.isArray(value)) {
      return value.map(item => item.toString()).join(',');
    }

    if (value === null || value === undefined) {
      return '';
    }

    return value.toString();
  }
}

