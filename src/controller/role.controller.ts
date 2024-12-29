import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { ApiCriteria, ApiPfds, ApiPagination } from "src/docs/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { Role } from "src/model";
import { RoleService } from "src/service";
import { Authenticated } from "src/auth/decorators";

@Controller()
@ApiTags("Users")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get("/roles")
  @ApiPagination()
  @ApiCriteria({ name: "name", type: "string" })
  @ApiPfds({
    operationId: "getRoles",
    type: [Role],
  })
  findAll(
    @Pagination() pagination: PaginationParams,
    @Query("name") name?: string
  ) {
    return this.roleService.findAll(pagination, { name });
  }

  @Get("/roles/:id")
  @Authenticated()
  @ApiPfds({
    operationId: "getRoleById",
    type: Role,
  })
  async findById(@Param("id") id: string) {
    const role = await this.roleService.findById(id);
    if (!role) {
      throw new NotFoundException();
    }
    return role;
  }
}
