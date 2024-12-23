import { PaginationParams } from "src/controller/decorators";
import { FindManyOptions } from "typeorm";

export function createPagination(
  pagination: PaginationParams
): FindManyOptions {
  return {
    take: pagination.pageSize,
    skip: (pagination.page - 1) * pagination.pageSize,
  };
}
