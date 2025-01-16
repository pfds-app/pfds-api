import { Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Ledger } from "src/model";
import { PaginationParams } from "src/controller/decorators";
import { findByCriteria } from "./utils/find-by-cireria";
import { UPDATED_AT_CREATED_AT_ORDER_BY } from "./utils/default-order-by";
import { Criteria } from "./utils/criteria";

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

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async saveLedgers(Ledgers: Ledger[]) {
    return this.repository.save(Ledgers);
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
