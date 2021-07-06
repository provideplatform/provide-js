import { Model } from "@provide/types";

export type PaginatedResponse<T> = {
  results: T[];
  totalResultsCount: number;
}

export type ApiClientResponse<T extends Model> = PaginatedResponse<T> | T | Promise<any>;