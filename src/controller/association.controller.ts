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
import { AssociationService } from "src/service";
import { Authenticated } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { Association } from "./rest";
import { AssociationMapper } from "./mapper";

@Controller()
@ApiTags("Resources")
export class AssociationController {
  constructor(
    private readonly associationService: AssociationService,
    private readonly associationMapper: AssociationMapper
  ) {}

  @Get("/associations")
  @ApiPagination()
  @Authenticated()
  @ApiCriteria({ name: "name", type: "string" })
  @ApiJfds({
    operationId: "getAssociations",
    type: [Association],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Query("name") name?: string
  ) {
    const associations = await this.associationService.findAll(pagination, {
      name,
    });
    return Promise.all(
      associations.map((role) => this.associationMapper.toRest(role))
    );
  }

  @Get("/associations/:id")
  @Authenticated()
  @ApiJfds({
    operationId: "getAssociationById",
    type: Association,
  })
  async findById(@Param("id") id: string) {
    const association = await this.associationService.findById(id);
    if (!association) {
      throw new NotFoundException();
    }
    return this.associationMapper.toRest(association);
  }

  @Put("/associations")
  @Authenticated()
  @ApiBody({ type: [Association] })
  @ApiJfds({
    operationId: "crupdateAssociations",
    type: [Association],
  })
  async crupdateAssociations(@Body() associations: Association[]) {
    const mapped = await Promise.all(
      associations.map((association) =>
        this.associationMapper.toDomain(association)
      )
    );
    const savedAssociations =
      await this.associationService.saveAssociations(mapped);
    return Promise.all(
      savedAssociations.map((association) =>
        this.associationMapper.toRest(association)
      )
    );
  }

  @Delete("/associations/:id")
  @Authenticated()
  @ApiJfds({
    operationId: "deleteAssociationById",
    type: Association,
  })
  async deleteAssociationById(@Param("id") id: string) {
    const deletedAssociation = await this.associationService.deleteById(id);
    return this.associationMapper.toRest(deletedAssociation);
  }
}
