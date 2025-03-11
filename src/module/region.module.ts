import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Region } from "src/model";
import { RegionMapper } from "src/controller/mapper";
import { RegionController } from "src/controller";
import { RegionService } from "src/service";
import { AuthModule } from "src/auth";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Region])],
  controllers: [RegionController],
  providers: [RegionService, RegionMapper],
  exports: [RegionService, RegionMapper],
})
export class RegionModule {}
