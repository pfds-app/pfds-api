import { Module } from "@nestjs/common";

import { DatabaseModule } from "./module/database";
import { AuthModule } from "./auth";
import { HealthModule, RoleModule, UserModule } from "./module";

@Module({
  imports: [DatabaseModule, HealthModule, RoleModule, UserModule, AuthModule],
})
export class PfdsModule {}
