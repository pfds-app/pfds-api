import { Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Event } from "src/model";
import { PaginationParams } from "src/controller/decorators";
import { findByCriteria } from "./utils/find-by-cireria";
import { UPDATED_AT_CREATED_AT_ORDER_BY } from "./utils/default-order-by";
import { Criteria } from "./utils/criteria";

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>
  ) {}

  async findAll(pagination: PaginationParams, criteria: Criteria<Event>) {
    return findByCriteria<Event>({
      repository: this.repository,
      criteria,
      pagination,
      order: UPDATED_AT_CREATED_AT_ORDER_BY,
    });
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async saveEvents(events: Event[]) {
    return this.repository.save(events);
  }

  async deleteById(id: string) {
    const toDelete = await this.findById(id);
    if (!toDelete) {
      throw new BadRequestException("No Event with id = " + id + " was found");
    }
    await this.repository.delete({ id });
    return toDelete;
  }
}
