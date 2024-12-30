import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { User } from "../user.entity";
import { UpdateUser, RestUser } from "../rest";
import { RoleService } from "src/service";
import { Repository } from "typeorm";
import { CreateUser } from "../rest/create-user";

@Injectable()
export class UserMapper {
  constructor(
    private readonly roleService: RoleService,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async toRest(user: User): Promise<RestUser> {
    const copiedUser = { ...user };
    delete copiedUser.password;
    return copiedUser;
  }

  async updateToDomain({ roleId, id, ...baseUser }: UpdateUser): Promise<User> {
    const beforeUpdateUser = await this.userRepository.findOneBy({ id });
    const role = await this.roleService.findById(roleId);

    if (!beforeUpdateUser) {
      throw new BadRequestException("User with id=" + id + " does not exist");
    }

    if (!role) {
      throw new BadRequestException(
        "Role with id=" + roleId + " does not exist"
      );
    }

    return this.userRepository.create({
      id,
      role,
      password: beforeUpdateUser.password,
      ...baseUser,
    });
  }

  async createToDomain({ roleId, ...baseUser }: CreateUser): Promise<User> {
    const role = await this.roleService.findById(roleId);
    if (!role) {
      throw new BadRequestException(
        "Role with id=" + roleId + " does not exist"
      );
    }

    return this.userRepository.create({
      ...baseUser,
      role,
    });
  }
}
