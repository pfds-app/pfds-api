import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { NestjsFormDataModule } from "nestjs-form-data";
import { join } from "path";

import { DatabaseModule } from "./module/database";
import { AuthModule } from "./auth";
import {
  HealthModule,
  UserModule,
  SacramentModule,
  RegionModule,
  CommitteeModule,
  AssociationModule,
  ResponsabilityModule,
  EventModule,
  LedgerModule,
  OperationModule,
  TicketModule,
  PayedTicketModule,
  ActivityModule,
  PresenceModule,
} from "./module";

@Module({
  imports: [
    NestjsFormDataModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "files"),
      serveRoot: "/files",
    }),
    DatabaseModule,
    HealthModule,
    UserModule,
    AuthModule,
    SacramentModule,
    RegionModule,
    CommitteeModule,
    AssociationModule,
    ResponsabilityModule,
    EventModule,
    LedgerModule,
    OperationModule,
    TicketModule,
    PayedTicketModule,
    ActivityModule,
    PresenceModule,
  ],
})
export class JfdsModule {}
