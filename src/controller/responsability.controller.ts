import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";

import { ApiCriteria, ApiJfds, ApiPagination } from "src/docs/decorators";
import { ResponsabilityService } from "src/service";
import { Authenticated } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { Responsability } from "./rest";
import { ResponsabilityMapper } from "./mapper";

@Controller()
@ApiTags("Resources")
export class ResponsabilityController {
  constructor(
    private readonly responsabilityService: ResponsabilityService,
    private readonly roleMapper: ResponsabilityMapper
  ) {}

  @Get("/responsabilities")
  @ApiPagination()
  @Authenticated()
  @ApiCriteria({ name: "name", type: "string" })
  @ApiJfds({
    operationId: "getResponsabilities",
    type: [Responsability],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Query("name") name?: string
  ) {
    const responsabilities = await this.responsabilityService.findAll(
      pagination,
      { name }
    );
    return Promise.all(
      responsabilities.map((role) => this.roleMapper.toRest(role))
    );
  }

  @Get("/responsabilities/:id")
  @Authenticated()
  @ApiJfds({
    operationId: "getResponsabilityById",
    type: Responsability,
  })
  async findById(@Param("id") id: string) {
    const role = await this.responsabilityService.findById(id);
    if (!role) {
      throw new NotFoundException();
    }
    return this.roleMapper.toRest(role);
  }

  @Put("/responsabilities")
  @Authenticated()
  @ApiBody({ type: [Responsability] })
  @ApiJfds({
    operationId: "crupdateResponsabilities",
    type: [Responsability],
  })
  async crupdateResponsabilities(@Body() responsabilities: Responsability[]) {
    const mapped = await Promise.all(
      responsabilities.map((role) => this.roleMapper.toDomain(role))
    );
    const savedResponsabilities =
      await this.responsabilityService.saveResponsabilities(mapped);
    return Promise.all(
      savedResponsabilities.map((role) => this.roleMapper.toRest(role))
    );
  }

  @Delete("/responsabilities/:id")
  @Authenticated()
  @ApiJfds({
    operationId: "deleteResponsabilityById",
    type: Responsability,
  })
  async deleteResponsabilityById(@Param("id") id: string) {
    const deletedResponsability =
      await this.responsabilityService.deleteById(id);
    return this.roleMapper.toRest(deletedResponsability);
  }
}
