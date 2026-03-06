export type QueryParamValue = string | number | boolean;

export type FilterOperator =
  | 'eq'
  | '='
  | '=='
  | 'ne'
  | '!='
  | '<>'
  | 'gt'
  | '>'
  | 'gte'
  | '>='
  | 'lt'
  | '<'
  | 'lte'
  | '<='
  | 'like'
  | 'ilike'
  | 'in'
  | 'notIn'
  | 'between'
  | 'null'
  | 'notNull'
  | 'date'
  | 'dateBetween';

export interface CriteriaFilter {
  field: string;
  operator?: FilterOperator;
  value?: QueryParamValue | QueryParamValue[];
}

export interface ListQueryOptions {
  page?: number;
  perPage?: number;
  search?: string;
  filters?: CriteriaFilter[];
  extraParams?: Record<string, QueryParamValue | null | undefined>;
}

