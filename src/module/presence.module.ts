import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Presence, User } from "src/model";
import { PresenceMapper } from "src/controller/mapper";
import { PresenceController } from "src/controller";
import { PresenceService } from "src/service";
import { UserModule } from "./user.module";
import { ActivityModule } from "./activity.module";

@Module({
  imports: [
    UserModule,
    ActivityModule,
    TypeOrmModule.forFeature([Presence, User]),
  ],
  controllers: [PresenceController],
  providers: [PresenceService, PresenceMapper],
  exports: [PresenceService, PresenceMapper],
})
export class PresenceModule {}
