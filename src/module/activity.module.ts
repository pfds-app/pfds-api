import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Activity } from "src/model";
import { ActivityMapper } from "src/controller/mapper";
import { ActivityController } from "src/controller";
import { ActivityService } from "src/service";

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityMapper],
  exports: [ActivityService, ActivityMapper],
})
export class ActivityModule {}
