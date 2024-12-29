import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { User } from "src/model";
import { PaginationParams } from "src/controller/decorators";
import {
  Criteria,
  findByCriteria,
  UPDATED_AT_CREATED_AT_ORDER_BY,
} from "./utils/findByCriteria";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>
  ) {}

  async findAll(pagination: PaginationParams, criteria: Criteria) {
    return findByCriteria({
      repository: this.repository,
      criteria,
      pagination,
      orderBy: UPDATED_AT_CREATED_AT_ORDER_BY,
    });
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async createUser(user: User) {
    return this.repository.create(user);
  }

  async findByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }

  async findByUsername(username: string) {
    return this.repository.findOneBy({ username });
  }
}
