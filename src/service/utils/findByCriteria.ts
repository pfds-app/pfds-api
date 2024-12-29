import { PaginationParams } from "src/controller/decorators";
import { Repository } from "typeorm";
import { createPagination } from "./create-pagination";

export type Criteria = Record<string, any>;
export type OrderByType = { sort: string; order: OrderValue }
export type OrderValue = "DESC" | "ASC";

export const UPDATED_AT_CREATED_AT_ORDER_BY: OrderByType[] = [
  {
    order: "DESC",
    sort: "updated_at"
  }, {
    order: "DESC",
    sort: "created_at"
  }
]

export const findByCriteria = async <T>({ orderBy = [], repository, criteria, pagination }: {
  repository: Repository<T>,
  criteria: Criteria,
  pagination: PaginationParams,
  orderBy?: OrderByType[]
}) => {
  const queryBuilder = repository.createQueryBuilder();
  const { skip, take } = createPagination(pagination);

  Object.entries(criteria).forEach(([key, value]) => {
    if (!value) return;
    queryBuilder.andWhere(`${key} ilike '%${value}%'`);
  });

  orderBy.forEach(orderByValue => {
    queryBuilder.addOrderBy(orderByValue.sort, orderByValue.order, "NULLS LAST");
  });

  return queryBuilder.skip(skip).take(take).getMany();
};
