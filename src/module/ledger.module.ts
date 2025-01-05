import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Ledger } from "src/model";
import { LedgerMapper } from "src/controller/mapper";
import { LedgerController } from "src/controller";
import { LedgerService } from "src/service";

@Module({
  imports: [TypeOrmModule.forFeature([Ledger])],
  controllers: [LedgerController],
  providers: [LedgerService, LedgerMapper],
  exports: [LedgerService, LedgerMapper],
})
export class LedgerModule {}
