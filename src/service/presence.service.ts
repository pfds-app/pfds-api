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
    connectedUser: User,
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
    const BaseFilter = {
      region: {
        id:
          connectedUser?.role === Role.ADMIN
            ? undefined
            : connectedUser.region?.id,
      },
      association: {
        id:
          connectedUser.role === Role.ADMIN ||
          connectedUser.role === Role.REGION_MANAGER
            ? undefined
            : connectedUser.role === Role.SIMPLE_USER ||
                connectedUser.role === Role.ASSOCIATION_MANAGER
              ? connectedUser.association?.id
              : undefined,
      },
      committee: {
        id:
          connectedUser.role === Role.ADMIN ||
          connectedUser.role === Role.REGION_MANAGER
            ? undefined
            : connectedUser.role === Role.SIMPLE_USER ||
                connectedUser.role === Role.COMMITTEE_MANAGER
              ? connectedUser.committee?.id
              : undefined,
      },
    };
    const filter = isForAll
      ? BaseFilter
      : [
          { role: Role.ADMIN, ...BaseFilter },
          { role: Role.COMMITTEE_MANAGER, ...BaseFilter },
          { role: Role.ASSOCIATION_MANAGER, ...BaseFilter },
          { role: Role.REGION_MANAGER, ...BaseFilter },
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

  async savePresences(
    activityId: string,
    presences: Presence[]
  ): Promise<Presence[]> {
    await this.validate(presences);
    const currentPresences = await this.repository.find({
      where: {
        activity: {
          id: activityId,
        },
      },
    });

    return await this.datasource.transaction(async (entityManager) => {
      if (currentPresences.length !== 0) {
        await entityManager.delete(
          Presence,
          currentPresences.map((el) => el.id)
        );
      }
      return entityManager.save(Presence, presences);
    });
  }

  async validate(presenceStatus: Presence[]) {
    if (presenceStatus.length == 0) {
      return;
    }

    const presenceId = presenceStatus[0].activity.id;
    if (presenceStatus.some((el) => el.activity.id !== presenceId)) {
      throw new BadRequestException(
        "Can create only a presence for one activity"
      );
    }
  }
}
