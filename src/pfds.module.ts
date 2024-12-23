import { Module } from "@nestjs/common";
import { DatabaseModule } from "./module/database";
import { BasicAuthModule, HealthModule, UserModule } from "./module";

@Module({
  imports: [DatabaseModule, BasicAuthModule, HealthModule, UserModule],
})
export class PfdsModule {}
