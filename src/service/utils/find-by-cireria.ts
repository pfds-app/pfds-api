import { FindManyOptions, Repository } from "typeorm";
import { Criteria } from "./criteria";
import { createPagination } from "./create-pagination";
import { PaginationParams } from "src/controller/decorators";

export const findByCriteria = async <T>({
  pagination,
  repository,
  criteria,
  ...findManyOptions
}: {
  pagination: PaginationParams;
  repository: Repository<T>;
  criteria: Criteria<T>;
} & FindManyOptions<T>) => {
  return repository.find({
    where: criteria,
    loadEagerRelations: true,
    ...createPagination(pagination),
    ...findManyOptions,
  });
};
