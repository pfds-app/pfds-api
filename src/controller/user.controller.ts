import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
} from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";

import { ApiCriteria, ApiJfds, ApiPagination } from "src/docs/decorators";
import { UserService } from "src/service";
import { Authenticated } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { UserMapper } from "./mapper";
import { ProfilePicture, UploadeSuccessResponse, User } from "./rest";

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
  @ApiCriteria(
    { name: "lastName", type: "string" },
    { name: "firstName", type: "string" }
  )
  @ApiJfds({
    operationId: "getUsers",
    type: [User],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Query("lastName") lastName?: string,
    @Query("firstName") firstName?: string
  ) {
    const users = await this.userService.findAll(pagination, {
      lastName,
      firstName,
    });
    return Promise.all(users.map((user) => this.userMapper.toRest(user)));
  }

  @Get("/users/:id")
  @Authenticated()
  @ApiJfds({
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

  @Put("/users/:id/picture/raw")
  @FormDataRequest()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Upload a user profile picture",
    required: true,
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiJfds({
    operationId: "updateProfilePicture",
    type: UploadeSuccessResponse,
  })
  async updateProfilePicture(
    @Param("id") id: string,
    @Body() profilePicture: ProfilePicture
  ) {
    return this.userService.updateProfilePicture(id, profilePicture.file);
  }
}
