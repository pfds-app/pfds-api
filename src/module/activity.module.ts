import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Activity } from "src/model";
import { ActivityMapper } from "src/controller/mapper";
import { ActivityController } from "src/controller";
import { ActivityService } from "src/service";
import { AuthModule } from "src/auth";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Activity])],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityMapper],
  exports: [ActivityService, ActivityMapper],
})
export class ActivityModule {}
