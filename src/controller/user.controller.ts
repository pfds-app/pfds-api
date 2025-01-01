import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { ApiCriteria, ApiPfds, ApiPagination } from "src/docs/decorators";
import { UserService } from "src/service";
import { Authenticated } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { UserMapper } from "./mapper";
import { User } from "./rest";

@Controller()
@ApiTags("Users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper
  ) { }

  @Get("/users")
  @Authenticated()
  @ApiPagination()
  @ApiCriteria({ name: "lastName", type: "string" })
  @ApiPfds({
    operationId: "getUsers",
    type: [User],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Query("lastName") lastName?: string
  ) {
    const users = await this.userService.findAll(pagination, {
      lastName,
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
