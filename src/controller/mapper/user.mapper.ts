import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User, CreateUser, UpdateUser } from "../rest";
import {
  Association,
  Committee,
  User as EntityUser,
  Region,
  Responsability,
} from "src/model";
import {
  AssociationService,
  CommitteeService,
  RegionService,
  ResponsabilityService,
} from "src/service";
import { ResponsabilityMapper } from "./responsability.mapper";
import { AssociationMapper } from "./association.mapper";
import { RegionMapper } from "./region.mapper";
import { CommitteeMapper } from "./committee.mapper";

@Injectable()
export class UserMapper {
  constructor(
    private readonly associationService: AssociationService,
    private readonly associationMapper: AssociationMapper,
    private readonly regionService: RegionService,
    private readonly regionMapper: RegionMapper,
    private readonly committeeService: CommitteeService,
    private readonly committeeMapper: CommitteeMapper,
    private readonly responsabilityService: ResponsabilityService,
    private readonly responsabilityMapper: ResponsabilityMapper,
    @InjectRepository(EntityUser)
    private readonly userRepository: Repository<EntityUser>
  ) {}

  async toRest(user: EntityUser): Promise<User> {
    const copiedEntityUser = { ...user };
    delete copiedEntityUser.password;
    return copiedEntityUser;
  }

  async updateToDomain({
    regionId,
    associationId,
    committeeId,
    responsabilityId,
    id,
    ...baseEntityUser
  }: UpdateUser): Promise<EntityUser> {
    const beforeUpdateEntityUser = await this.userRepository.findOneBy({ id });
    if (!beforeUpdateEntityUser) {
      throw new BadRequestException(
        "EntityUser with id=" + id + " does not exist"
      );
    }

    let region: Region;
    if (regionId) {
      region = await this.regionService.findById(regionId);
    }

    let association: Association;
    if (associationId) {
      association = await this.associationService.findById(associationId);
    }

    let committee: Committee;
    if (committeeId) {
      committee = await this.committeeService.findById(committeeId);
    }

    let responsability: Responsability;
    if (responsabilityId) {
      responsability =
        await this.responsabilityService.findById(responsabilityId);
    }

    return this.userRepository.create({
      id,
      responsability: responsability
        ? await this.responsabilityMapper.toDomain(responsability)
        : undefined,
      committee: committee
        ? await this.committeeMapper.toDomain(committee)
        : undefined,
      region: region ? await this.regionMapper.toDomain(region) : undefined,
      association: association
        ? await this.associationMapper.toDomain(association)
        : undefined,
      password: beforeUpdateEntityUser.password,
      photo: beforeUpdateEntityUser.photo,
      ...baseEntityUser,
    });
  }

  async createToDomain({
    responsabilityId,
    committeeId,
    associationId,
    regionId,
    ...baseEntityUser
  }: CreateUser): Promise<EntityUser> {
    let region: Region;
    if (regionId) {
      region = await this.regionService.findById(regionId);
    }

    let association: Association;
    if (associationId) {
      association = await this.associationService.findById(associationId);
    }

    let committee: Committee;
    if (committeeId) {
      committee = await this.committeeService.findById(committeeId);
    }

    let responsability: Responsability;
    if (responsabilityId) {
      responsability =
        await this.responsabilityService.findById(responsabilityId);
    }

    return this.userRepository.create({
      ...baseEntityUser,
      responsability: responsability
        ? await this.responsabilityMapper.toDomain(responsability)
        : undefined,
      committee: committee
        ? await this.committeeMapper.toDomain(committee)
        : undefined,
      region: region ? await this.regionMapper.toDomain(region) : undefined,
      association: association
        ? await this.associationMapper.toDomain(association)
        : undefined,
    });
  }
}
