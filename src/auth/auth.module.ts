import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./startegy";
import { JwtAuthGuard } from "./guards";
import { Role, User } from "src/model";
import { RoleService, UserService } from "src/service";
import { UserMapper } from "src/model/mapper";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get("JWT_SECRET"),
          signOptions: {
            // 5m | 5h | 5d
            expiresIn: "5h",
          },
        };
      },
    }),
    TypeOrmModule.forFeature([Role, User]),
  ],
  providers: [
    JwtAuthGuard,
    JwtStrategy,
    AuthService,
    RoleService,
    UserMapper,
    UserService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
