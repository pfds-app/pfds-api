import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Association as EntityAssociation } from "src/model";
import { Association } from "../rest";

@Injectable()
export class AssociationMapper {
  constructor(
    @InjectRepository(EntityAssociation)
    private readonly associationRepository: Repository<EntityAssociation>
  ) {}

  async toRest(association: EntityAssociation): Promise<Association> {
    return {
      ...association,
    };
  }

  async toDomain(association: Association): Promise<EntityAssociation> {
    return this.associationRepository.create(association);
  }
}
