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
import { CommitteeService } from "src/service";
import { Authenticated } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { Committee } from "./rest";
import { CommitteeMapper } from "./mapper";

@Controller()
@ApiTags("Resources")
export class CommitteeController {
  constructor(
    private readonly committeeService: CommitteeService,
    private readonly committeeMapper: CommitteeMapper
  ) {}

  @Get("/committees")
  @ApiPagination()
  @ApiCriteria({ name: "name", type: "string" })
  @ApiJfds({
    operationId: "getCommittees",
    type: [Committee],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Query("name") name?: string
  ) {
    const committees = await this.committeeService.findAll(pagination, {
      name,
    });
    return Promise.all(
      committees.map((role) => this.committeeMapper.toRest(role))
    );
  }

  @Get("/committees/:id")
  @ApiJfds({
    operationId: "getCommitteeById",
    type: Committee,
  })
  async findById(@Param("id") id: string) {
    const committee = await this.committeeService.findById(id);
    if (!committee) {
      throw new NotFoundException();
    }
    return this.committeeMapper.toRest(committee);
  }

  @Put("/committees")
  @Authenticated()
  @ApiBody({ type: [Committee] })
  @ApiJfds({
    operationId: "crupdateCommittees",
    type: [Committee],
  })
  async crupdateCommittees(@Body() committees: Committee[]) {
    const mapped = await Promise.all(
      committees.map((committee) => this.committeeMapper.toDomain(committee))
    );
    const savedCommittees = await this.committeeService.saveCommittees(mapped);
    return Promise.all(
      savedCommittees.map((committee) => this.committeeMapper.toRest(committee))
    );
  }

  @Delete("/committees/:id")
  @Authenticated()
  @ApiJfds({
    operationId: "deleteCommitteeById",
    type: Committee,
  })
  async deleteCommitteeById(@Param("id") id: string) {
    const deletedCommittee = await this.committeeService.deleteById(id);
    return this.committeeMapper.toRest(deletedCommittee);
  }
}
