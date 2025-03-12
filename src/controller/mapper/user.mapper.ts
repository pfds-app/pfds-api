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
  Sacrament,
} from "src/model";
import {
  AssociationService,
  CommitteeService,
  RegionService,
  ResponsabilityService,
  SacramentService,
} from "src/service";
import { ResponsabilityMapper } from "./responsability.mapper";
import { AssociationMapper } from "./association.mapper";
import { RegionMapper } from "./region.mapper";
import { CommitteeMapper } from "./committee.mapper";
import { SacramentMapper } from "./sacrament.mapper";

@Injectable()
export class UserMapper {
  constructor(
    private readonly sacramentService: SacramentService,
    private readonly associationService: AssociationService,
    private readonly associationMapper: AssociationMapper,
    private readonly regionService: RegionService,
    private readonly regionMapper: RegionMapper,
    private readonly committeeService: CommitteeService,
    private readonly committeeMapper: CommitteeMapper,
    private readonly responsabilityService: ResponsabilityService,
    private readonly responsabilityMapper: ResponsabilityMapper,
    private readonly sacramentMapper: SacramentMapper,
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
    sacramentId,
    id,
    ...baseEntityUser
  }: UpdateUser): Promise<EntityUser> {
    const beforeUpdateEntityUser = await this.userRepository.findOneBy({ id });
    if (!beforeUpdateEntityUser) {
      throw new BadRequestException(
        "EntityUser with id=" + id + " does not exist"
      );
    }

    let sacrament: Sacrament;
    if (sacramentId) {
      sacrament = await this.sacramentService.findById(sacramentId);
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
      sacrament: sacrament
        ? await this.sacramentMapper.toDomain(sacrament)
        : null,
      responsability: responsability
        ? await this.responsabilityMapper.toDomain(responsability)
        : null,
      committee: committee
        ? await this.committeeMapper.toDomain(committee)
        : null,
      region: region ? await this.regionMapper.toDomain(region) : null,
      association: association
        ? await this.associationMapper.toDomain(association)
        : null,
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
    sacramentId,
    ...baseEntityUser
  }: CreateUser): Promise<EntityUser> {
    let sacrament: Sacrament;
    if (sacramentId) {
      sacrament = await this.sacramentService.findById(sacramentId);
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
      ...baseEntityUser,
      sacrament: sacrament
        ? await this.sacramentMapper.toDomain(sacrament)
        : null,
      responsability: responsability
        ? await this.responsabilityMapper.toDomain(responsability)
        : null,
      committee: committee
        ? await this.committeeMapper.toDomain(committee)
        : null,
      region: region ? await this.regionMapper.toDomain(region) : null,
      association: association
        ? await this.associationMapper.toDomain(association)
        : null,
    });
  }
}
