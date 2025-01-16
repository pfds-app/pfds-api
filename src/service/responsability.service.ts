import { Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Responsability } from "src/model";
import { PaginationParams } from "src/controller/decorators";
import { Criteria } from "./utils/criteria";
import { findByCriteria } from "./utils/find-by-cireria";
import { UPDATED_AT_CREATED_AT_ORDER_BY } from "./utils/default-order-by";

@Injectable()
export class ResponsabilityService {
  constructor(
    @InjectRepository(Responsability)
    private readonly repository: Repository<Responsability>
  ) {}

  async findAll(
    pagination: PaginationParams,
    criteria: Criteria<Responsability>
  ) {
    return findByCriteria<Responsability>({
      repository: this.repository,
      criteria,
      pagination,
      order: UPDATED_AT_CREATED_AT_ORDER_BY,
    });
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async saveResponsabilities(responsabilities: Responsability[]) {
    return this.repository.save(responsabilities);
  }

  async deleteById(id: string) {
    const toDelete = await this.findById(id);
    if (!toDelete) {
      throw new BadRequestException(
        "No Responsability with id = " + id + " was found"
      );
    }
    await this.repository.softDelete({ id });
    return toDelete;
  }
}
