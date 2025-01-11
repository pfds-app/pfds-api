import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User, CreateUser, UpdateUser } from "../rest";
import { User as EntityUser } from "src/model";
import { RoleService } from "src/service";
import { RoleMapper } from "./role.mapper";

@Injectable()
export class UserMapper {
  constructor(
    private readonly roleService: RoleService,
    private readonly roleMapper: RoleMapper,
    @InjectRepository(EntityUser)
    private readonly userRepository: Repository<EntityUser>
  ) {}

  async toRest(user: EntityUser): Promise<User> {
    const copiedEntityUser = { ...user };
    delete copiedEntityUser.password;
    return copiedEntityUser;
  }

  async updateToDomain({
    roleId,
    id,
    ...baseEntityUser
  }: UpdateUser): Promise<EntityUser> {
    const beforeUpdateEntityUser = await this.userRepository.findOneBy({ id });
    const role = await this.roleService.findById(roleId);

    if (!beforeUpdateEntityUser) {
      throw new BadRequestException(
        "EntityUser with id=" + id + " does not exist"
      );
    }

    if (!role) {
      throw new BadRequestException(
        "Role with id=" + roleId + " does not exist"
      );
    }

    return this.userRepository.create({
      id,
      role: await this.roleMapper.toDomain(role),
      password: beforeUpdateEntityUser.password,
      photo: beforeUpdateEntityUser.photo,
      ...baseEntityUser,
    });
  }

  async createToDomain({
    roleId,
    ...baseEntityUser
  }: CreateUser): Promise<EntityUser> {
    const role = await this.roleService.findById(roleId);
    if (!role) {
      throw new BadRequestException(
        "Role with id=" + roleId + " does not exist"
      );
    }

    return this.userRepository.create({
      ...baseEntityUser,
      role,
    });
  }
}
