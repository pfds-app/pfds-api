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
import { RegionService } from "src/service";
import { Authenticated } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { Region } from "./rest";
import { RegionMapper } from "./mapper";
import { Role } from "src/model";

@Controller()
@ApiTags("Resources")
export class RegionController {
  constructor(
    private readonly regionService: RegionService,
    private readonly regionMapper: RegionMapper
  ) {}

  @Get("/regions")
  @ApiPagination()
  @ApiCriteria({ name: "name", type: "string" })
  @ApiJfds({
    operationId: "getRegions",
    type: [Region],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Query("name") name?: string
  ) {
    const regions = await this.regionService.findAll(pagination, {
      name,
    });
    return Promise.all(regions.map((role) => this.regionMapper.toRest(role)));
  }

  @Get("/regions/:id")
  @ApiJfds({
    operationId: "getRegionById",
    type: Region,
  })
  async findById(@Param("id") id: string) {
    const region = await this.regionService.findById(id);
    if (!region) {
      throw new NotFoundException();
    }
    return this.regionMapper.toRest(region);
  }

  @Put("/regions")
  @Authenticated({ roles: [Role.ADMIN] })
  @ApiBody({ type: [Region] })
  @ApiJfds({
    operationId: "crupdateRegions",
    type: [Region],
  })
  async crupdateRegions(@Body() regions: Region[]) {
    const mapped = await Promise.all(
      regions.map((region) => this.regionMapper.toDomain(region))
    );
    const savedRegions = await this.regionService.saveRegions(mapped);
    return Promise.all(
      savedRegions.map((region) => this.regionMapper.toRest(region))
    );
  }

  @Delete("/regions/:id")
  @Authenticated({ roles: [Role.ADMIN] })
  @ApiJfds({
    operationId: "deleteRegionById",
    type: Region,
  })
  async deleteRegionById(@Param("id") id: string) {
    const deletedRegion = await this.regionService.deleteById(id);
    return this.regionMapper.toRest(deletedRegion);
  }
}
