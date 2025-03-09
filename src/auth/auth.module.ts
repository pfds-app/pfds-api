import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./startegy";
import { JwtAuthGuard, RoleGuard } from "./guards";
import {
  Association,
  Committee,
  Region,
  Responsability,
  Sacrament,
  User,
} from "src/model";
import {
  AssociationService,
  CommitteeService,
  RegionService,
  ResponsabilityService,
  SacramentService,
  UserService,
} from "src/service";
import {
  AssociationMapper,
  CommitteeMapper,
  RegionMapper,
  ResponsabilityMapper,
  SacramentMapper,
  UserMapper,
} from "src/controller/mapper";
import { UserValidator } from "src/service/validator/user.validator";

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
            expiresIn: configService.get("JWT_EXPIRATION_TIME"),
          },
        };
      },
    }),
    TypeOrmModule.forFeature([
      Responsability,
      User,
      Association,
      Committee,
      Region,
      Sacrament,
    ]),
  ],
  providers: [
    JwtAuthGuard,
    JwtStrategy,
    AuthService,
    ResponsabilityService,
    ResponsabilityMapper,
    UserValidator,
    UserMapper,
    UserService,
    CommitteeService,
    CommitteeMapper,
    RegionService,
    RegionMapper,
    AssociationService,
    AssociationMapper,
    SacramentService,
    SacramentMapper,
    RoleGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
