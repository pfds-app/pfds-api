import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Activity as EntityActivity } from "src/model";
import { Activity } from "../rest";

@Injectable()
export class ActivityMapper {
  constructor(
    @InjectRepository(EntityActivity)
    private readonly activityRepository: Repository<EntityActivity>
  ) {}

  async toRest(activity: EntityActivity): Promise<Activity> {
    return {
      ...activity,
    };
  }

  async toDomain(activity: Activity): Promise<EntityActivity> {
    return this.activityRepository.create(activity);
  }
}
