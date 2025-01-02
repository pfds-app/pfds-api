import { ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import {
  Association,
  Committee,
  Dummy,
  Region,
  Responsability,
  Role,
  Sacrament,
  User,
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
          Role,
          Sacrament,
          Region,
          Committee,
          Association,
          Responsability,
        ],
        //WARNING: remove synchronize on prod
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
