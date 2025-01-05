import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Ledger as EntityLedger } from "src/model";
import { Ledger } from "../rest";

@Injectable()
export class LedgerMapper {
  constructor(
    @InjectRepository(EntityLedger)
    private readonly ledgerRepository: Repository<EntityLedger>
  ) {}

  async toRest(ledger: EntityLedger): Promise<Ledger> {
    return {
      ...ledger,
    };
  }

  async toDomain(ledger: Ledger): Promise<EntityLedger> {
    return this.ledgerRepository.create(ledger);
  }
}
