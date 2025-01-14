import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
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
import {
  CreateUser,
  ProfilePicture,
  UpdateUser,
  UploadeSuccessResponse,
  User,
} from "./rest";
import { Role } from "src/model";
import { UserGenderStat } from "src/service/model";

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
  @ApiCriteria({
    name: "role",
    type: "string",
    enum: Role,
  })
  @ApiJfds({
    operationId: "getUsers",
    type: [User],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Query("role") role?: Role
  ) {
    const users = await this.userService.findAll(pagination, {
      role,
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

  @Put("/users/infos")
  @ApiBody({
    type: UpdateUser,
  })
  @ApiJfds({
    operationId: "updateUserInfo",
    type: User,
  })
  async updateUser(@Body() updateUser: UpdateUser) {
    const mappedUser = await this.userMapper.updateToDomain(updateUser);
    const user = await this.userService.updateUserInfos(mappedUser);
    return this.userMapper.toRest(user);
  }

  @Post("/users")
  @ApiBody({
    type: CreateUser,
  })
  @ApiJfds({
    operationId: "createUser",
    type: User,
  })
  async createUser(@Body() createUser: CreateUser) {
    const mappedUser = await this.userMapper.createToDomain(createUser);
    const user = await this.userService.createUser(mappedUser);
    return this.userMapper.toRest(user);
  }

  @Get("/users/genders/stats")
  @ApiCriteria(
    { name: "fromDate", type: "string", format: "date" },
    { name: "endDate", type: "string", format: "date" }
  )
  @ApiJfds({
    operationId: "getUserGenderStats",
    type: [UserGenderStat],
  })
  async getUserGenderStats(
    @Query("fromDate") fromDate: string,
    @Query("endDate") endDate: string
  ) {
    return this.userService.getUserGenderStats(fromDate, endDate);
  }
}
