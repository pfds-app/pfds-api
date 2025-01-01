import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Role as EntityRole } from "src/model";
import { Role } from "../rest";

@Injectable()
export class RoleMapper {
  constructor(
    @InjectRepository(EntityRole) private readonly roleRepository: Repository<EntityRole>
  ) { }

  async toRest(role: EntityRole): Promise<Role> {
    return {
      ...role
    }
  }

  async toDomain(role: Role): Promise<EntityRole> {
    return this.roleRepository.create(role);
  }
}
