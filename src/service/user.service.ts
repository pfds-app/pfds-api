import { Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { User } from "src/model";
import { PaginationParams } from "src/controller/decorators";
import { Criteria } from "./utils/criteria";
import { UPDATED_AT_CREATED_AT_ORDER_BY } from "./utils/default-order-by";
import { findByCriteria } from "./utils/find-by-cireria";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>
  ) {}

  async findAll(pagination: PaginationParams, criteria: Criteria<User>) {
    return findByCriteria<User>({
      repository: this.repository,
      criteria,
      pagination,
      order: UPDATED_AT_CREATED_AT_ORDER_BY,
    });
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async createUser(user: User): Promise<User> {
    if (await this.findById(user.id)) {
      throw new BadRequestException("User with the given id already exist");
    }

    const createdUser = this.repository.create(user);
    return this.repository.save(createdUser);
  }

  async findByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }

  async findByUsername(username: string) {
    return this.repository.findOneBy({ username });
  }
}
