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
import { RoleService } from "src/service";
import { Authenticated } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { Role } from "./rest";
import { RoleMapper } from "./mapper";

@Controller()
@ApiTags("Users")
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly roleMapper: RoleMapper
  ) {}

  @Get("/roles")
  @ApiPagination()
  @ApiCriteria({ name: "name", type: "string" })
  @ApiJfds({
    operationId: "getRoles",
    type: [Role],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Query("name") name?: string
  ) {
    const roles = await this.roleService.findAll(pagination, { name });
    return Promise.all(roles.map((role) => this.roleMapper.toRest(role)));
  }

  @Get("/roles/:id")
  @ApiJfds({
    operationId: "getRoleById",
    type: Role,
  })
  async findById(@Param("id") id: string) {
    const role = await this.roleService.findById(id);
    if (!role) {
      throw new NotFoundException();
    }
    return this.roleMapper.toRest(role);
  }

  @Put("/roles")
  @Authenticated()
  @ApiBody({ type: [Role] })
  @ApiJfds({
    operationId: "crupdateRoles",
    type: [Role],
  })
  async crupdateRoles(@Body() roles: Role[]) {
    const mapped = await Promise.all(
      roles.map((role) => this.roleMapper.toDomain(role))
    );
    const savedRoles = await this.roleService.saveRoles(mapped);
    return Promise.all(savedRoles.map((role) => this.roleMapper.toRest(role)));
  }

  @Delete("/roles/:id")
  @Authenticated()
  @ApiJfds({
    operationId: "deleteRoleById",
    type: Role,
  })
  async deleteRoleById(@Param("id") id: string) {
    const deletedRole = await this.roleService.deleteById(id);
    return this.roleMapper.toRest(deletedRole);
  }
}
