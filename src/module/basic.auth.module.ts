import { Module } from "@nestjs/common";
import { BasicAuthService } from "src/service/basic.auth.service";

@Module({
  providers: [BasicAuthService],
  exports: [BasicAuthService],
})
export class BasicAuthModule {}
