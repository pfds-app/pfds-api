import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthController } from "src/controller";
import { HealthService } from "src/service";
import { Dummy } from "src/model";
import { BasicAuthModule } from "./basic.auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Dummy]), BasicAuthModule],
  providers: [HealthService],
  controllers: [HealthController],
})
export class HealthModule {}
