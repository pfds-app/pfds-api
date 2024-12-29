import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { HealthController } from "src/controller";
import { HealthService } from "src/service";
import { Dummy } from "src/model";
import { AuthModule } from "src/auth";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Dummy])],
  providers: [HealthService],
  controllers: [HealthController],
})
export class HealthModule {}
