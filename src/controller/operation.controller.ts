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
import { OperationService } from "src/service";
import { Authenticated } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { Operation } from "./rest";
import { OperationMapper } from "./mapper";
import { Role } from "src/model";

@Controller()
@ApiTags("Moneys")
export class OperationController {
  constructor(
    private readonly operationService: OperationService,
    private readonly operationMapper: OperationMapper
  ) {}

  @Get("/operations")
  @ApiPagination()
  @Authenticated()
  @ApiCriteria({ name: "name", type: "string" })
  @ApiJfds({
    operationId: "getOperations",
    type: [Operation],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Query("name") name?: string
  ) {
    const operations = await this.operationService.findAll(pagination, {
      name,
    });
    return Promise.all(
      operations.map((role) => this.operationMapper.toRest(role))
    );
  }

  @Get("/operations/:id")
  @Authenticated()
  @ApiJfds({
    operationId: "getOperationById",
    type: Operation,
  })
  async findById(@Param("id") id: string) {
    const operation = await this.operationService.findById(id);
    if (!operation) {
      throw new NotFoundException();
    }
    return this.operationMapper.toRest(operation);
  }

  @Put("/operations")
  @Authenticated({ roles: [Role.ADMIN] })
  @ApiBody({ type: [Operation] })
  @ApiJfds({
    operationId: "crupdateOperations",
    type: [Operation],
  })
  async crupdateOperations(@Body() operations: Operation[]) {
    const mapped = await Promise.all(
      operations.map((operation) => this.operationMapper.toDomain(operation))
    );
    const savedOperations = await this.operationService.saveOperations(mapped);
    return Promise.all(
      savedOperations.map((operation) => this.operationMapper.toRest(operation))
    );
  }

  @Delete("/operations/:id")
  @Authenticated({ roles: [Role.ADMIN] })
  @ApiJfds({
    operationId: "deleteOperationById",
    type: Operation,
  })
  async deleteOperationById(@Param("id") id: string) {
    const deletedOperation = await this.operationService.deleteById(id);
    return this.operationMapper.toRest(deletedOperation);
  }
}
