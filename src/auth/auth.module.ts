import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./startegy";
import { JwtAuthGuard } from "./guards";
import { User } from "src/model";
import { UserService } from "src/service";
import { UserMapper } from "src/model/mapper";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: "5h" },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    UserService,
    UserMapper,
    JwtAuthGuard,
    JwtStrategy,
    AuthService,
    UserService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
