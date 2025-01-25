import { Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Ledger } from "src/model";
import { LedgerStat } from "./model";
import { PaginationParams } from "src/controller/decorators";
import { Criteria } from "./utils/criteria";
import { findByCriteria } from "./utils/find-by-cireria";
import { UPDATED_AT_CREATED_AT_ORDER_BY } from "./utils/default-order-by";

export enum LedgerStatType {
  ACCULUMATED = "ACCULUMATED",
  PER_YEAR = "PER_YEAR",
}

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(Ledger)
    private readonly repository: Repository<Ledger>
  ) {}

  async findAll(pagination: PaginationParams, criteria: Criteria<Ledger>) {
    return findByCriteria<Ledger>({
      repository: this.repository,
      criteria,
      pagination,
      order: UPDATED_AT_CREATED_AT_ORDER_BY,
    });
  }

  async getLedgerStatByYear(year: number): Promise<LedgerStat[]> {
    return this.repository
      .createQueryBuilder("entity")
      .select("month.month", "month")
      .addSelect(
        `COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM a.date) = month.month THEN a.value END), 0)`,
        "total"
      )
      .from((subQuery) => {
        return subQuery
          .select("generate_series(1, 12)", "month")
          .from("generate_series(1, 12)", "month");
      }, "month")
      .leftJoin(
        "A",
        "a",
        "EXTRACT(MONTH FROM a.date) = month.month AND EXTRACT(YEAR FROM a.date) = :year",
        { year }
      )
      .addSelect("COUNT(*)", "totalCount")
      .groupBy("month.month")
      .orderBy("month.month", "ASC")
      .getRawMany();
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async saveLedgers(ledgers: Ledger[]) {
    return this.repository.save(ledgers);
  }

  async deleteById(id: string) {
    const toDelete = await this.findById(id);
    if (!toDelete) {
      throw new BadRequestException("No Ledger with id = " + id + " was found");
    }
    await this.repository.softDelete({ id });
    return toDelete;
  }
}
