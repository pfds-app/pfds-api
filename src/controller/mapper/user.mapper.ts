import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User, CreateUser, UpdateUser } from "../rest";
import { User as EntityUser } from "src/model";
import {
  AssociationService,
  CommitteeService,
  RegionService,
  RoleService,
} from "src/service";
import { RoleMapper } from "./role.mapper";
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
    private readonly roleService: RoleService,
    private readonly roleMapper: RoleMapper,
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
    roleId,
    id,
    ...baseEntityUser
  }: UpdateUser): Promise<EntityUser> {
    const beforeUpdateEntityUser = await this.userRepository.findOneBy({ id });
    const region = await this.regionService.findById(regionId);
    const association = await this.associationService.findById(associationId);
    const committee = await this.committeeService.findById(committeeId);
    const role = await this.roleService.findById(roleId);

    if (!beforeUpdateEntityUser) {
      throw new BadRequestException(
        "EntityUser with id=" + id + " does not exist"
      );
    }

    if (!role) {
      throw new BadRequestException(
        "Role with id=" + roleId + " does not exist"
      );
    }

    if (!region) {
      throw new BadRequestException(
        "Region with id=" + regionId + " does not exist"
      );
    }

    if (!association) {
      throw new BadRequestException(
        "Association with id=" + associationId + " does not exist"
      );
    }

    if (!committee) {
      throw new BadRequestException(
        "Committee with id=" + committeeId + " does not exist"
      );
    }

    return this.userRepository.create({
      id,
      role: await this.roleMapper.toDomain(role),
      committee: await this.committeeMapper.toDomain(committee),
      region: await this.regionMapper.toDomain(region),
      association: await this.associationMapper.toDomain(association),
      password: beforeUpdateEntityUser.password,
      photo: beforeUpdateEntityUser.photo,
      ...baseEntityUser,
    });
  }

  async createToDomain({
    roleId,
    committeeId,
    associationId,
    regionId,
    ...baseEntityUser
  }: CreateUser): Promise<EntityUser> {
    const role = await this.roleService.findById(roleId);
    const region = await this.regionService.findById(regionId);
    const association = await this.associationService.findById(associationId);
    const committee = await this.committeeService.findById(committeeId);

    if (!role) {
      throw new BadRequestException(
        "Role with id=" + roleId + " does not exist"
      );
    }

    if (!region) {
      throw new BadRequestException(
        "Region with id=" + regionId + " does not exist"
      );
    }

    if (!association) {
      throw new BadRequestException(
        "Association with id=" + associationId + " does not exist"
      );
    }

    if (!committee) {
      throw new BadRequestException(
        "Committee with id=" + committeeId + " does not exist"
      );
    }

    return this.userRepository.create({
      ...baseEntityUser,
      role,
      committee,
      region,
      association,
    });
  }
}
