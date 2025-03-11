import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Association } from "src/model";
import { AssociationMapper } from "src/controller/mapper";
import { AssociationController } from "src/controller";
import { AssociationService } from "src/service";
import { AuthModule } from "src/auth";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Association])],
  controllers: [AssociationController],
  providers: [AssociationService, AssociationMapper],
  exports: [AssociationService, AssociationMapper],
})
export class AssociationModule {}
