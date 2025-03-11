import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Responsability } from "src/model";
import { ResponsabilityMapper } from "src/controller/mapper";
import { ResponsabilityController } from "src/controller";
import { ResponsabilityService } from "src/service";
import { AuthModule } from "src/auth";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Responsability])],
  controllers: [ResponsabilityController],
  providers: [ResponsabilityService, ResponsabilityMapper],
  exports: [ResponsabilityService, ResponsabilityMapper],
})
export class ResponsabilityModule {}
