import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { MoreThanOrEqual } from "typeorm";
import { ApiCriteria, ApiJfds, ApiPagination } from "src/docs/decorators";

import { ActivityService } from "src/service";
import { Authenticated, AuthenticatedUser } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { Activity } from "./rest";
import { ActivityMapper } from "./mapper";
import { ActivityRoleType, Role, User } from "src/model";

@Controller()
@ApiTags("Resources")
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly activityMapper: ActivityMapper
  ) {}

  @Get("/activities")
  @ApiPagination()
  @Authenticated()
  @ApiCriteria(
    { name: "name", type: "string" },
    { name: "afterDate", type: "string", format: "date" }
  )
  @ApiJfds({
    operationId: "getActivities",
    type: [Activity],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Query("name") name?: string,
    @Query("afterDate") afterDate?: string
  ) {
    const activities = await this.activityService.findAll(pagination, {
      name,
      beginDate: afterDate ? MoreThanOrEqual(afterDate) : undefined,
    });
    return Promise.all(
      activities.map((role) => this.activityMapper.toRest(role))
    );
  }

  @Get("/activities/:id")
  @Authenticated()
  @ApiJfds({
    operationId: "getActivityById",
    type: Activity,
  })
  async findById(@Param("id") id: string) {
    const activity = await this.activityService.findById(id);
    if (!activity) {
      throw new NotFoundException();
    }
    return this.activityMapper.toRest(activity);
  }

  @Put("/activities")
  @Authenticated()
  @ApiBody({ type: [Activity] })
  @ApiJfds({
    operationId: "crupdateActivities",
    type: [Activity],
  })
  async crupdateactivities(
    @AuthenticatedUser() authenticatedUser: User,
    @Body() activities: Activity[]
  ) {
    if (
      activities.find(
        (activity) =>
          activity.roleType === ActivityRoleType.MANAGER &&
          authenticatedUser.role !== Role.ADMIN
      )
    ) {
      throw new ForbiddenException(
        "Cannot create activity with type ALL if not manager"
      );
    }

    const mapped = await Promise.all(
      activities.map((activity) => this.activityMapper.toDomain(activity))
    );
    const savedactivities = await this.activityService.saveActivities(mapped);
    return Promise.all(
      savedactivities.map((activity) => this.activityMapper.toRest(activity))
    );
  }

  @Delete("/activities/:id")
  @Authenticated({ roles: [Role.ADMIN] })
  @ApiJfds({
    operationId: "deleteActivityById",
    type: Activity,
  })
  async deleteActivityById(@Param("id") id: string) {
    const deletedActivity = await this.activityService.deleteById(id);
    return this.activityMapper.toRest(deletedActivity);
  }
}
