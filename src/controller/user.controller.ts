import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { Authenticated, AuthenticatedUser } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { UserMapper } from "./mapper";
import {
  CreateUser,
  ProfilePicture,
  UpdateUser,
  UploadeSuccessResponse,
  User,
} from "./rest";
import { Role, UserGender, User as EntityUser, DeletedRole } from "src/model";
import { UserStat } from "src/service/model";
import { ILike, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Count } from "./rest/count";
import { UPDATED_AT_CREATED_AT_ORDER_BY } from "src/service/utils/default-order-by";

@Controller()
@ApiTags("Users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
    @InjectRepository(EntityUser)
    private readonly userRepository: Repository<EntityUser>
  ) {}

  @Get("/users-member-count")
  @Authenticated()
  @ApiJfds({
    operationId: "getUserMemberCount",
    type: Count,
  })
  async getUserMemberCount(
    @AuthenticatedUser() user: EntityUser
  ): Promise<Count> {
    const users = await this.userRepository.find({
      where: {
        region: {
          id: user?.role === Role.ADMIN ? undefined : user?.region?.id,
        },
        association: {
          id:
            user?.role === Role.ADMIN || user?.role === Role.REGION_MANAGER
              ? undefined
              : user.association?.id,
        },
        committee: {
          id:
            user?.role === Role.ADMIN || user?.role === Role.REGION_MANAGER
              ? undefined
              : user.committee?.id,
        },
      },
      order: UPDATED_AT_CREATED_AT_ORDER_BY,
    });

    return { value: users.length };
  }

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
    { name: "sacramentId", type: "string" },
    { name: "associationId", type: "string" },
    { name: "responsabilityId", type: "string" },
    { name: "q", type: "string" },
    { name: "gender", type: "string", enum: UserGender }
  )
  @ApiJfds({
    operationId: "getUsers",
    type: [User],
  })
  async findAll(
    @AuthenticatedUser() user: EntityUser,
    @Pagination() pagination: PaginationParams,
    @Query("q") q?: string,
    @Query("role") role?: Role,
    @Query("nic") nic?: string,
    @Query("apv") apv?: string,
    @Query("lastName") lastName?: string,
    @Query("firstName") firstName?: string,
    @Query("username") username?: string,
    @Query("responsabilityId") responsabilityId?: string,
    @Query("sacramentId") sacramentId?: string,
    @Query("regionId") regionId?: string,
    @Query("committeeId") committeeId?: string,
    @Query("associationId") associationId?: string,
    @Query("gender") gender?: UserGender
  ) {
    const isFindSimpleUser = role === Role.SIMPLE_USER;
    const filter = {
      nic,
      apv,
      gender,
      username,
      lastName,
      firstName,
      role: isFindSimpleUser ? undefined : role,
      region: {
        id: user.role === Role.ADMIN ? regionId : user.region?.id,
      },
      association: {
        id: q
          ? undefined
          : user.role === Role.ADMIN || user.role === Role.REGION_MANAGER
            ? associationId
            : user.role === Role.SIMPLE_USER ||
                user.role === Role.ASSOCIATION_MANAGER
              ? user.association?.id
              : undefined,
      },
      committee: {
        id: q
          ? undefined
          : user.role === Role.ADMIN || user.role === Role.REGION_MANAGER
            ? committeeId
            : user.role === Role.SIMPLE_USER ||
                user.role === Role.COMMITTEE_MANAGER
              ? user.committee?.id
              : undefined,
      },
      responsability: {
        id: responsabilityId,
      },
      sacrament: {
        id: sacramentId,
      },
    };

    const users = await this.userService.findAll(
      pagination,
      q
        ? [
            { ...filter, firstName: ILike(`${q}%`) },
            { ...filter, lastName: ILike(`${q}%`) },
          ]
        : filter
    );
    return Promise.all(users.map((el) => this.userMapper.toRest(el)));
  }

  @Get("/users/:id")
  @Authenticated({ selfRegionMatcher: "id" })
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
  @Authenticated({ selfMatcher: "id" })
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

  @Put("/users/:id/infos")
  @Authenticated({ selfMatcher: "id", selfRegionMatcher: "id" })
  @ApiBody({
    type: UpdateUser,
  })
  @ApiJfds({
    operationId: "updateUserInfo",
    type: User,
  })
  async updateUser(
    @Param("id") _id: string,
    @AuthenticatedUser() authenticatedUser: EntityUser,
    @Body() updateUser: UpdateUser
  ) {
    const mappedUser = await this.userMapper.updateToDomain(updateUser);
    const user = await this.userService.updateUserInfos(
      authenticatedUser,
      mappedUser
    );
    return this.userMapper.toRest(user);
  }

  @Post("/users")
  @Authenticated({ roles: [Role.ADMIN, Role.REGION_MANAGER] })
  @ApiBody({
    type: CreateUser,
  })
  @ApiJfds({
    operationId: "createUser",
    type: User,
  })
  async createUser(
    @AuthenticatedUser() authenticatedUser: User,
    @Body() createUser: CreateUser
  ) {
    const isAdmin = authenticatedUser.role === Role.ADMIN;
    const mappedUser = await this.userMapper.createToDomain(createUser);

    if (!isAdmin && authenticatedUser.region?.id !== mappedUser.region?.id) {
      throw new ForbiddenException(
        "Should create only a user with the same region"
      );
    }

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
  @Authenticated()
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

  @Get("/deleted-roles")
  @Authenticated()
  @ApiPagination()
  @ApiCriteria({
    name: "role",
    type: "string",
    enum: Role,
  })
  @ApiJfds({
    operationId: "findDeletedRoles",
    type: [DeletedRole],
  })
  async findDeletedRoles(
    @Pagination() pagination: PaginationParams,
    @Query("role") role?: Role
  ) {
    const deletedRoles = await this.userService.findDeletedRoles(pagination, {
      role,
    });
    return Promise.all(
      deletedRoles.map((deletedRole) => ({
        ...deletedRole,
        user: this.userMapper.toRest(deletedRole.user),
      }))
    );
  }
}
