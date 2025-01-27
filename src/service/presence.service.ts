import { DataSource, Repository } from "typeorm";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { ActivityRoleType, Presence, Role, User } from "src/model";
import { ActivityService } from "./activity.service";
import { PresenceStatus } from "./model";
import { PaginationParams } from "src/controller/decorators";
import { createPagination } from "./utils/create-pagination";
import { UPDATED_AT_CREATED_AT_ORDER_BY } from "./utils/default-order-by";

@Injectable()
export class PresenceService {
  constructor(
    @InjectRepository(Presence)
    private readonly repository: Repository<Presence>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly activityService: ActivityService,
    private readonly datasource: DataSource
  ) {}

  async getPresenceStatus(
    pagination: PaginationParams,
    activityId: string,
    getIsPresent?: boolean
  ): Promise<PresenceStatus[]> {
    const activity = await this.activityService.findById(activityId);
    if (!activity) {
      throw new NotFoundException(
        "Activity with id = " + activity + " was not found"
      );
    }

    const presences = await this.repository.find({
      where: {
        activity: {
          id: activityId,
        },
      },
    });

    const isForAll = activity.roleType === ActivityRoleType.ALL;
    const filter = isForAll
      ? undefined
      : [
          { role: Role.ADMIN },
          { role: Role.COMMITTEE_MANAGER },
          { role: Role.ASSOCIATION_MANAGER },
          { role: Role.REGION_MANAGER },
        ];
    const users = await this.userRepository.find({
      where: filter,
      order: UPDATED_AT_CREATED_AT_ORDER_BY,
    });

    let results = users.map((user) => {
      const isPresent = presences.find(
        (presence) => presence.user.id === user.id
      );
      return {
        user,
        isPresent: !!isPresent,
      };
    });

    if (getIsPresent !== undefined) {
      results = results.filter((el) => el.isPresent === getIsPresent);
    }

    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return results.slice(start, end);
  }

  async savePresences(presences: Presence[]): Promise<Presence[]> {
    await this.validate(presences);
    const currentPresences = await this.repository.find({
      where: {
        activity: {
          id: presences[0].activity.id,
        },
      },
    });

    return await this.datasource.transaction(async (entityManager) => {
      await entityManager.delete(
        Presence,
        currentPresences.map((el) => el.id)
      );
      return entityManager.save(Presence, presences);
    });
  }

  async validate(presenceStatus: Presence[]) {
    if (presenceStatus.length < 1) {
      throw new BadRequestException("Can create at least one activity");
    }

    const presenceId = presenceStatus[0].activity.id;
    if (presenceStatus.some((el) => el.activity.id !== presenceId)) {
      throw new BadRequestException(
        "Can create only a presence for one activity"
      );
    }
  }
}
