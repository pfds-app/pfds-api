import { ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import {
  Association,
  Committee,
  Dummy,
  Region,
  Responsability,
  Sacrament,
  User,
  Event,
  Ledger,
  Operation,
  Ticket,
  PayedTicket,
  Activity,
} from "src/model";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        url: configService.get("DATABASE_URL"),
        entities: [
          Dummy,
          User,
          Sacrament,
          Region,
          Committee,
          Association,
          Responsability,
          Event,
          Ledger,
          Operation,
          Ticket,
          PayedTicket,
          Activity,
        ],
        //WARNING: remove synchronize on prod
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
