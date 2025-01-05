import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Operation } from "src/model";
import { OperationMapper } from "src/controller/mapper";
import { OperationController } from "src/controller";
import { OperationService } from "src/service";

@Module({
  imports: [TypeOrmModule.forFeature([Operation])],
  controllers: [OperationController],
  providers: [OperationService, OperationMapper],
  exports: [OperationService, OperationMapper],
})
export class OperationModule {}
