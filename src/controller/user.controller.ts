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
import { User } from "src/model";
import { UserService } from "src/service";
import { Authenticated } from "src/auth/decorators";
import { RestUser } from "src/model/rest";
import { UserMapper } from "src/model/mapper";

@Controller()
@ApiTags("Users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper
  ) {}

  @Get("/users")
  @Authenticated()
  @ApiPagination()
  @ApiCriteria({ name: "lastName", type: "string" })
  @ApiPfds({
    operationId: "getUsers",
    type: [RestUser],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Query("lastName") lastName?: string
  ) {
    const users = await this.userService.findAll(pagination, {
      last_name: lastName,
    });
    return Promise.all(users.map((user) => this.userMapper.toRest(user)));
  }

  @Get("/users/:id")
  @Authenticated()
  @ApiPfds({
    operationId: "getUserById",
    type: User,
  })
  async findById(@Param("id") id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return this.userMapper.toRest(user);
  }
}
