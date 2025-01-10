import { Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Event } from "src/model";
import { PaginationParams } from "src/controller/decorators";
import { Criteria } from "./utils/criteria";
import { findByCriteria } from "./utils/find-by-cireria";

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
      order: {
        beginDate: "DESC",
        endDate: "DESC",
        updatedAt: "DESC",
        createdAt: "DESC",
      },
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
