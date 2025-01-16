import { Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Activity } from "src/model";
import { PaginationParams } from "src/controller/decorators";
import { Criteria } from "./utils/criteria";
import { findByCriteria } from "./utils/find-by-cireria";
import { UPDATED_AT_CREATED_AT_ORDER_BY } from "./utils/default-order-by";

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>
  ) {}

  async findAll(pagination: PaginationParams, criteria: Criteria<Activity>) {
    return findByCriteria<Activity>({
      repository: this.repository,
      criteria,
      pagination,
      order: {
        beginDate: "DESC",
        endDate: "DESC",
        ...UPDATED_AT_CREATED_AT_ORDER_BY,
      },
    });
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async saveActivities(activities: Activity[]) {
    return this.repository.save(activities);
  }

  async deleteById(id: string) {
    const toDelete = await this.findById(id);
    if (!toDelete) {
      throw new BadRequestException(
        "No Activity with id = " + id + " was found"
      );
    }
    await this.repository.softDelete({ id });
    return toDelete;
  }
}
