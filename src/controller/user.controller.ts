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

@Controller()
@ApiTags("Users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/users")
  @Authenticated()
  @ApiPagination()
  @ApiCriteria({ name: "lastName", type: "string" })
  @ApiPfds({
    operationId: "getUsers",
    type: [User],
  })
  findAll(
    @Pagination() pagination: PaginationParams,
    @Query("lastName") lastName?: string
  ) {
    return this.userService.findAll(pagination, { last_name: lastName });
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
    return user;
  }
}
