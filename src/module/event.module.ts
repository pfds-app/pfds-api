import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Event } from "src/model";
import { EventMapper } from "src/controller/mapper";
import { EventController } from "src/controller";
import { EventService } from "src/service";

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventController],
  providers: [EventService, EventMapper],
  exports: [EventService, EventMapper],
})
export class EventModule {}
