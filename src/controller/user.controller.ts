import {
  Body,
  Controller,
  Delete,
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
import { UserService, UserStatType } from "src/service";
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
import { Role, UserGender } from "src/model";
import { UserStat } from "src/service/model";

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
    {
      name: "role",
      type: "string",
      enum: Role,
    },
    { name: "nic", type: "string" },
    { name: "apv", type: "string" },
    { name: "lastName", type: "string" },
    { name: "firstName", type: "string" },
    { name: "username", type: "string" },
    { name: "regionId", type: "string" },
    { name: "committeeId", type: "string" },
    { name: "associationId", type: "string" },
    { name: "responsabilityId", type: "string" },
    { name: "gender", type: "string", enum: UserGender }
  )
  @ApiJfds({
    operationId: "getUsers",
    type: [User],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Query("role") role?: Role,
    @Query("nic") nic?: string,
    @Query("apv") apv?: string,
    @Query("lastName") lastName?: string,
    @Query("firstName") firstName?: string,
    @Query("username") username?: string,
    @Query("regionId") regionId?: string,
    @Query("committeeId") committeeId?: string,
    @Query("associationId") associationId?: string,
    @Query("responsabilityId") responsabilityId?: string,
    @Query("gender") gender?: UserGender
  ) {
    const users = await this.userService.findAll(pagination, {
      nic,
      role,
      apv,
      gender,
      username,
      lastName,
      firstName,
      region: {
        id: regionId,
      },
      association: {
        id: associationId,
      },
      committee: {
        id: committeeId,
      },
      responsability: {
        id: responsabilityId,
      },
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
  @Authenticated()
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
  @Authenticated()
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

  @Get("/users/members/stats")
  @ApiCriteria(
    { name: "type", type: "string", enum: UserStatType, required: true },
    { name: "fromDate", type: "string", format: "date" },
    { name: "endDate", type: "string", format: "date" }
  )
  @ApiJfds({
    operationId: "getUserMembersStats",
    type: [UserStat],
  })
  async getUserCreatedStatByYear(
    @Query("fromDate") fromDate: string,
    @Query("endDate") endDate: string,
    @Query("type") type: UserStatType
  ) {
    return this.userService.getUserMemberStats(fromDate, endDate, type);
  }

  @Delete("/users/:id")
  @Authenticated({ roles: [Role.ADMIN] })
  @ApiJfds({
    operationId: "deleteUserById",
    type: User,
  })
  async deleteUserById(@Param("id") id: string) {
    const deletedUser = await this.userService.deleteById(id);
    return this.userMapper.toRest(deletedUser);
  }
}
