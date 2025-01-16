import { Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Operation } from "src/model";
import { PaginationParams } from "src/controller/decorators";
import { findByCriteria } from "./utils/find-by-cireria";
import { UPDATED_AT_CREATED_AT_ORDER_BY } from "./utils/default-order-by";
import { Criteria } from "./utils/criteria";

@Injectable()
export class OperationService {
  constructor(
    @InjectRepository(Operation)
    private readonly repository: Repository<Operation>
  ) {}

  async findAll(pagination: PaginationParams, criteria: Criteria<Operation>) {
    return findByCriteria<Operation>({
      repository: this.repository,
      criteria,
      pagination,
      order: UPDATED_AT_CREATED_AT_ORDER_BY,
    });
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async saveOperations(operations: Operation[]) {
    return this.repository.save(operations);
  }

  async deleteById(id: string) {
    const toDelete = await this.findById(id);
    if (!toDelete) {
      throw new BadRequestException(
        "No Operation with id = " + id + " was found"
      );
    }
    await this.repository.softDelete({ id });
    return toDelete;
  }
}
