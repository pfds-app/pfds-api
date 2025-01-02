import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Responsability as EntityResponsability } from "src/model";
import { Responsability } from "../rest";

@Injectable()
export class ResponsabilityMapper {
  constructor(
    @InjectRepository(EntityResponsability)
    private readonly responsabilityRepository: Repository<EntityResponsability>
  ) {}

  async toRest(responsability: EntityResponsability): Promise<Responsability> {
    return {
      ...responsability,
    };
  }

  async toDomain(
    responsability: Responsability
  ): Promise<EntityResponsability> {
    return this.responsabilityRepository.create(responsability);
  }
}
