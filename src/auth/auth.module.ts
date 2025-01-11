import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./startegy";
import { JwtAuthGuard } from "./guards";
import { Association, Committee, Region, Role, User } from "src/model";
import {
  AssociationService,
  CommitteeService,
  RegionService,
  RoleService,
  UserService,
} from "src/service";
import {
  AssociationMapper,
  CommitteeMapper,
  RegionMapper,
  RoleMapper,
  UserMapper,
} from "src/controller/mapper";

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
    TypeOrmModule.forFeature([Role, User, Association, Committee, Region]),
  ],
  providers: [
    JwtAuthGuard,
    JwtStrategy,
    AuthService,
    RoleService,
    RoleMapper,
    UserMapper,
    UserService,
    CommitteeService,
    CommitteeMapper,
    RegionService,
    RegionMapper,
    AssociationService,
    AssociationMapper,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
