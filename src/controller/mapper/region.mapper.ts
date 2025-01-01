import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Region as EntityRegion } from "src/model";
import { Region } from "../rest";

@Injectable()
export class RegionMapper {
  constructor(
    @InjectRepository(EntityRegion)
    private readonly regionRepository: Repository<EntityRegion>
  ) {}

  async toRest(region: EntityRegion): Promise<Region> {
    return {
      ...region,
    };
  }

  async toDomain(region: Region): Promise<EntityRegion> {
    return this.regionRepository.create(region);
  }
}
