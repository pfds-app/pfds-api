import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Presence as EntityPresence } from "src/model";
import { PresenceStatus as ServicePresenceStatus } from "src/service/model";
import { Presence, PresenceStatus, CreatePresence } from "../rest";
import { UserMapper } from "./user.mapper";
import { ActivityMapper } from "./activity.mapper";
import { ActivityService, UserService } from "src/service";

@Injectable()
export class PresenceMapper {
  constructor(
    @InjectRepository(EntityPresence)
    private readonly presenceRepository: Repository<EntityPresence>,
    private readonly userService: UserService,
    private readonly activityService: ActivityService,
    private readonly activityMapper: ActivityMapper,
    private readonly userMapper: UserMapper
  ) {}

  async toRest({
    user,
    activity,
    ...presence
  }: EntityPresence): Promise<Presence> {
    const mappedUser = await this.userMapper.toRest(user);
    const mappedActivity = await this.activityMapper.toRest(activity);

    return {
      ...presence,
      activity: mappedActivity,
      user: mappedUser,
    };
  }

  async statusToRest({
    user,
    ...presence
  }: ServicePresenceStatus): Promise<PresenceStatus> {
    const mappedUser = await this.userMapper.toRest(user);
    return { ...presence, user: mappedUser };
  }

  async createToDomain({
    userId,
    activityId,
    ...presence
  }: CreatePresence): Promise<EntityPresence> {
    const user = await this.userService.findById(userId);
    const activity = await this.activityService.findById(activityId);

    if (!user || !activity) {
      throw new NotFoundException("No User or activity specified");
    }

    return this.presenceRepository.create({
      ...presence,
      user,
      activity,
    });
  }
}
