import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "./module/database";
import { AuthModule } from "./auth";
import {
  HealthModule,
  RoleModule,
  UserModule,
  SacramentModule,
  RegionModule,
  CommitteeModule,
  AssociationModule,
  ResponsabilityModule,
} from "./module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    HealthModule,
    RoleModule,
    UserModule,
    AuthModule,
    SacramentModule,
    RegionModule,
    CommitteeModule,
    AssociationModule,
    ResponsabilityModule,
  ],
})
export class JfdsModule {}
