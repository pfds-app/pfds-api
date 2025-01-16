import { Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Sacrament } from "src/model";
import { PaginationParams } from "src/controller/decorators";
import { findByCriteria } from "./utils/find-by-cireria";
import { UPDATED_AT_CREATED_AT_ORDER_BY } from "./utils/default-order-by";
import { Criteria } from "./utils/criteria";

@Injectable()
export class SacramentService {
  constructor(
    @InjectRepository(Sacrament)
    private readonly repository: Repository<Sacrament>
  ) {}

  async findAll(pagination: PaginationParams, criteria: Criteria<Sacrament>) {
    return findByCriteria<Sacrament>({
      repository: this.repository,
      criteria,
      pagination,
      order: UPDATED_AT_CREATED_AT_ORDER_BY,
    });
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async saveSacraments(sacraments: Sacrament[]) {
    return this.repository.save(sacraments);
  }

  async deleteById(id: string) {
    const toDelete = await this.findById(id);
    if (!toDelete) {
      throw new BadRequestException(
        "No Sacrament with id = " + id + " was found"
      );
    }
    await this.repository.softDelete({ id });
    return toDelete;
  }
}
