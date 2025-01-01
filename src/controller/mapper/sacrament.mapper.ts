import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Sacrament as EntitySacrament } from "src/model";
import { Sacrament } from "../rest";

@Injectable()
export class SacramentMapper {
  constructor(
    @InjectRepository(EntitySacrament)
    private readonly sacramentRepository: Repository<EntitySacrament>
  ) {}

  async toRest(sacrament: EntitySacrament): Promise<Sacrament> {
    return {
      ...sacrament,
    };
  }

  async toDomain(sacrament: Sacrament): Promise<EntitySacrament> {
    return this.sacramentRepository.create(sacrament);
  }
}
