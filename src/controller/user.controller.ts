import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiCriteria, ApiPfds, ApiPagination } from "src/docs/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { User } from "src/model";
import { UserService } from "src/service";

@Controller()
@ApiTags("Users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/users")
  @ApiPagination()
  @ApiCriteria({ name: "name", type: "string" })
  @ApiPfds({
    operationId: "getUsers",
    type: [User],
  })
  findAll(
    @Pagination() pagination: PaginationParams,
    @Query("name") name?: string
  ) {
    return this.userService.findAll(pagination, { name });
  }

  @Get("/users/:id")
  @ApiPfds({
    operationId: "getUserById",
    type: User,
  })
  findById(@Param("id") id: string) {
    return this.userService.findById(id);
  }
}
