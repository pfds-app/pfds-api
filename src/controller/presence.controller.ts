import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";

import { ApiJfds, ApiPagination } from "src/docs/decorators";
import { PresenceService } from "src/service";
import { Authenticated } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { CreatePresence, Presence, PresenceStatus } from "./rest";
import { PresenceMapper } from "./mapper";
import { Role } from "src/model";

@Controller()
@ApiTags("Resources")
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly presenceMapper: PresenceMapper
  ) {}

  @Get("/activities/:activityId/status")
  @ApiPagination()
  @Authenticated()
  @ApiJfds({
    operationId: "getPresencesStatus",
    type: [PresenceStatus],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Param("activityId") activityId: string
  ) {
    const presenceStatus = await this.presenceService.getPresenceStatus(
      pagination,
      activityId
    );
    return Promise.all(
      presenceStatus.map((el) => this.presenceMapper.statusToRest(el))
    );
  }

  @Put("/activities/:activityId/presences")
  @Authenticated({
    roles: [
      Role.ADMIN,
      Role.REGION_MANAGER,
      Role.COMMITTEE_MANAGER,
      Role.ASSOCIATION_MANAGER,
    ],
  })
  @ApiBody({ type: [CreatePresence] })
  @ApiJfds({
    operationId: "crupdatePresences",
    type: [Presence],
  })
  async crupdatePresences(
    @Param("activityId") _activityId: string,
    @Body() presences: CreatePresence[]
  ) {
    const mapped = await Promise.all(
      presences.map((presence) => this.presenceMapper.createToDomain(presence))
    );

    const savedPresences = await this.presenceService.savePresences(mapped);

    return Promise.all(
      savedPresences.map((presence) => this.presenceMapper.toRest(presence))
    );
  }
}
