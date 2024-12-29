import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/model";
import { PaginationParams } from "src/controller/decorators";
import { UPDATED_AT_CREATED_AT_ORDER_BY, Criteria, findByCriteria } from "./utils/findByCriteria";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly repository: Repository<Role>
  ) { }

  async findAll(pagination: PaginationParams, criteria: Criteria) {
    return findByCriteria({ repository: this.repository, criteria, pagination, orderBy: UPDATED_AT_CREATED_AT_ORDER_BY });
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async saveRole(user: Role) {
    return this.repository.save(user);
  }
}
