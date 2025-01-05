import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Operation as EntityOperation } from "src/model";
import { Operation } from "../rest";

@Injectable()
export class OperationMapper {
  constructor(
    @InjectRepository(EntityOperation)
    private readonly operationRepository: Repository<EntityOperation>
  ) {}

  async toRest(operation: EntityOperation): Promise<Operation> {
    return {
      ...operation,
    };
  }

  async toDomain(operation: Operation): Promise<EntityOperation> {
    return this.operationRepository.create(operation);
  }
}
