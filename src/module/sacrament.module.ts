import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Sacrament } from "src/model";
import { SacramentMapper } from "src/controller/mapper";
import { SacramentController } from "src/controller";
import { SacramentService } from "src/service";
import { AuthModule } from "src/auth";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Sacrament])],
  controllers: [SacramentController],
  providers: [SacramentService, SacramentMapper],
  exports: [SacramentService, SacramentMapper],
})
export class SacramentModule {}
