import { Repository } from "typeorm";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MemoryStoredFile } from "nestjs-form-data";
import { v4 as uuid } from "uuid";
import * as fs from "fs";
import * as path from "path";

import { User } from "src/model";
import { PaginationParams } from "src/controller/decorators";
import { Criteria } from "./utils/criteria";
import { UploadeSuccessResponse } from "src/controller/rest";
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
    user.photo = undefined; // should not set profile image only with updateProfilePicture
    const createdUser = this.repository.create(user);
    return this.repository.save(createdUser);
  }

  async findByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }

  async findByUsername(username: string) {
    return this.repository.findOneBy({ username });
  }

  async updateProfilePicture(
    userId: string,
    file: MemoryStoredFile
  ): Promise<UploadeSuccessResponse> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(
        "User with id = " + userId + " was not found"
      );
    }
    if (!file.extension) {
      throw new BadRequestException("File must have an extension");
    }

    const userPhoto = (user.photo ?? uuid() + ".png").split(".")[0];
    const fileName = `${userPhoto}.${file.extension}`;
    const uploadDir = path.join(__dirname, "..", "..", "files");
    const filePath = path.join(uploadDir, fileName);

    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.writeFileSync(filePath, file.buffer);
    } catch (error) {
      throw new InternalServerErrorException(
        "Error occured whe try to update profile picture"
      );
    }

    user.photo = fileName;
    await this.repository.save(user);
    return {
      fileName,
      message: "File uploaded with success",
    };
  }
}
