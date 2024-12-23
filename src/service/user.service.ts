import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/model";
import { PaginationParams } from "src/controller/decorators";
import { Criteria, findByCriteria } from "./utils/findByCriteria";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>
  ) {}

  async findAll(pagination: PaginationParams, criteria: Criteria) {
    return findByCriteria(this.repository, criteria, pagination);
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async saveUser(user: User) {
    return this.repository.save(user);
  }

  async findByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }
}
