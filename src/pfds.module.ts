import { Module } from "@nestjs/common";
import { DatabaseModule } from "./module/database";
import { AuthModule } from "./auth";
import { BasicAuthModule, HealthModule, RoleModule, UserModule } from "./module";

@Module({
  imports: [DatabaseModule, BasicAuthModule, AuthModule, HealthModule, RoleModule, UserModule],
})
export class PfdsModule { }
