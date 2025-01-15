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
import { SacramentService } from "src/service";
import { Authenticated } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { Sacrament } from "./rest";
import { SacramentMapper } from "./mapper";
import { Role } from "src/model";

@Controller()
@ApiTags("Resources")
export class SacramentController {
  constructor(
    private readonly sacramentService: SacramentService,
    private readonly sacramentMapper: SacramentMapper
  ) {}

  @Get("/sacraments")
  @Authenticated()
  @ApiPagination()
  @ApiCriteria({ name: "name", type: "string" })
  @ApiJfds({
    operationId: "getSacraments",
    type: [Sacrament],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Query("name") name?: string
  ) {
    const sacraments = await this.sacramentService.findAll(pagination, {
      name,
    });
    return Promise.all(
      sacraments.map((role) => this.sacramentMapper.toRest(role))
    );
  }

  @Get("/sacraments/:id")
  @Authenticated()
  @ApiJfds({
    operationId: "getSacramentById",
    type: Sacrament,
  })
  async findById(@Param("id") id: string) {
    const sacrament = await this.sacramentService.findById(id);
    if (!sacrament) {
      throw new NotFoundException();
    }
    return this.sacramentMapper.toRest(sacrament);
  }

  @Put("/sacraments")
  @Authenticated({ roles: [Role.ADMIN] })
  @ApiBody({ type: [Sacrament] })
  @ApiJfds({
    operationId: "crupdateSacraments",
    type: [Sacrament],
  })
  async crupdateSacraments(@Body() sacraments: Sacrament[]) {
    const mapped = await Promise.all(
      sacraments.map((sacrament) => this.sacramentMapper.toDomain(sacrament))
    );
    const savedSacraments = await this.sacramentService.saveSacraments(mapped);
    return Promise.all(
      savedSacraments.map((sacrament) => this.sacramentMapper.toRest(sacrament))
    );
  }

  @Delete("/sacraments/:id")
  @Authenticated({ roles: [Role.ADMIN] })
  @ApiJfds({
    operationId: "deleteSacramentById",
    type: Sacrament,
  })
  async deleteSacramentById(@Param("id") id: string) {
    const deletedSacrament = await this.sacramentService.deleteById(id);
    return this.sacramentMapper.toRest(deletedSacrament);
  }
}
