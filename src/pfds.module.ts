import { Module } from "@nestjs/common";
import { DatabaseModule } from "./module/database";
import { AuthModule } from "./auth";
import { BasicAuthModule, HealthModule, UserModule } from "./module";

@Module({
  imports: [DatabaseModule, BasicAuthModule, AuthModule, HealthModule, UserModule],
})
export class PfdsModule { }