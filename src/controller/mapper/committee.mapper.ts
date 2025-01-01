import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Committee as EntityCommittee } from "src/model";
import { Committee } from "../rest";

@Injectable()
export class CommitteeMapper {
  constructor(
    @InjectRepository(EntityCommittee)
    private readonly committeeRepository: Repository<EntityCommittee>
  ) {}

  async toRest(committee: EntityCommittee): Promise<Committee> {
    return {
      ...committee,
    };
  }

  async toDomain(committee: Committee): Promise<EntityCommittee> {
    return this.committeeRepository.create(committee);
  }
}
