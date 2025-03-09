import { DataSource, Repository } from "typeorm";
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

import { DeletedRole, Role, User } from "src/model";
import { PaginationParams } from "src/controller/decorators";
import { Criteria } from "./utils/criteria";
import { UploadeSuccessResponse } from "src/controller/rest";
import { UserValidator } from "./validator/user.validator";
import { UserStat } from "./model";
import { findByCriteria } from "./utils/find-by-cireria";
import { UPDATED_AT_CREATED_AT_ORDER_BY } from "./utils/default-order-by";

export enum UserStatType {
  ACCULUMATED = "ACCULUMATED",
  PER_YEAR = "PER_YEAR",
}

type StringUserStat = {
  maleCount: string;
  femaleCount: string;
  totalCount: string;
  year: string;
};

const mapStringUserStatToNumber = (
  stringUserStat: StringUserStat
): UserStat => ({
  year: +stringUserStat.year,
  femaleCount: +stringUserStat.femaleCount,
  totalCount: +stringUserStat.totalCount,
  maleCount: +stringUserStat.maleCount,
});
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    @InjectRepository(DeletedRole)
    private readonly deletedRoleRepository: Repository<DeletedRole>,
    private readonly userValidator: UserValidator,
    private readonly datasource: DataSource
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

    await this.userValidator.checkRequiredFieldsByRole(user);
    user.photo = undefined; // should not set profile image (only with updateProfilePicture)
    const createdUser = this.repository.create(user); // just to make the password will be hashed

    try {
      return await this.repository.save(createdUser);
    } catch (error) {
      if (error?.code === "23505") {
        throw new BadRequestException("Email or Username already exists.");
      }
      throw error;
    }
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
    } catch {
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

  async updateUserInfos(user: User): Promise<User> {
    await this.userValidator.checkRequiredFieldsByRole(user);
    try {
      return await this.repository.save(user);
    } catch (error) {
      if (error?.code === "23505") {
        throw new BadRequestException("Email or Username already exists.");
      }
      throw error;
    }
  }

  async getUserCreatedStatByYear(
    fromDate: string,
    endDate: string
  ): Promise<UserStat[]> {
    const rawData: UserStat[] = await this.repository
      .createQueryBuilder("entity")
      .select("EXTRACT(YEAR FROM entity.createdAt)", "year")
      .addSelect(
        "COUNT(CASE WHEN entity.gender = 'MALE' THEN 1 END)",
        "maleCount"
      )
      .addSelect(
        "COUNT(CASE WHEN entity.gender = 'FEMALE' THEN 1 END)",
        "femaleCount"
      )
      .addSelect("COUNT(*)", "totalCount")
      .where("entity.createdAt BETWEEN :fromDate AND :endDate", {
        fromDate,
        endDate,
      })
      .groupBy("EXTRACT(YEAR FROM entity.createdAt)")
      .orderBy("year", "ASC")
      .getRawMany();

    const fromYear = new Date(fromDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();

    if (!rawData.find((stat) => stat.year == fromYear)) {
      rawData.unshift({
        year: fromYear,
        maleCount: 0,
        femaleCount: 0,
        totalCount: 0,
      });
    }

    if (!rawData.find((stat) => stat.year == endYear)) {
      rawData.push({
        year: endYear,
        maleCount: 0,
        femaleCount: 0,
        totalCount: 0,
      });
    }

    return rawData;
  }

  async getUserMemberStatByYear(
    fromDate: string,
    endDate: string
  ): Promise<UserStat[]> {
    const rawData: {
      maleCount: string;
      femaleCount: string;
      totalCount: string;
      year: string;
    }[] = await this.repository
      .createQueryBuilder("entity")
      .select("EXTRACT(YEAR FROM entity.createdAt)", "year")
      .addSelect(
        "COUNT(CASE WHEN entity.gender = 'MALE' THEN 1 END)",
        "maleCount"
      )
      .addSelect(
        "COUNT(CASE WHEN entity.gender = 'FEMALE' THEN 1 END)",
        "femaleCount"
      )
      .addSelect("COUNT(*)", "totalCount")
      .where("entity.createdAt <= :endDate", { endDate })
      .groupBy("EXTRACT(YEAR FROM entity.createdAt)")
      .orderBy("year", "ASC")
      .getRawMany();

    const fromYear = new Date(fromDate).getFullYear();
    const indexOfCreatedUserAfterFromYear = rawData.findIndex(
      (stat) => +stat.year > fromYear
    );

    const results: UserStat[] = rawData.map((stat, index) => {
      const mappedStat = mapStringUserStatToNumber(stat);
      if (index === 0) {
        return mappedStat;
      }

      const prevStat = rawData[index - 1];
      mappedStat.totalCount += +prevStat.totalCount;
      mappedStat.femaleCount += +prevStat.femaleCount;
      mappedStat.maleCount += +prevStat.maleCount;
      return mappedStat;
    });
    return indexOfCreatedUserAfterFromYear !== -1
      ? results.slice(indexOfCreatedUserAfterFromYear, rawData.length)
      : results;
  }

  async getUserMemberStats(
    fromDate: string,
    endDate: string,
    type: UserStatType
  ) {
    switch (type) {
      case UserStatType.PER_YEAR:
        return this.getUserCreatedStatByYear(fromDate, endDate);
      default:
        return this.getUserMemberStatByYear(fromDate, endDate);
    }
  }

  async deleteById(id: string) {
    const toDelete = await this.findById(id);
    if (!toDelete) {
      throw new BadRequestException("No User with id = " + id + " was found");
    }
    await this.repository.softDelete({ id });
    return toDelete;
  }

  async deleteUserRole(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException("No User with id = " + id + " was found");
    }

    user.role = Role.SIMPLE_USER;

    return await this.datasource.transaction(async (entityManager) => {
      const toSave = entityManager.create(DeletedRole, {
        id: uuid(),
        role: user.role,
        user,
      });

      await entityManager.save(DeletedRole, toSave);
      return entityManager.save(user);
    });
  }
  async findDeletedRoles(
    pagination: PaginationParams,
    criteria: Criteria<DeletedRole>
  ) {
    return findByCriteria<DeletedRole>({
      repository: this.deletedRoleRepository,
      criteria,
      pagination,
      order: {
        createdAt: "DESC",
      },
    });
  }
}
