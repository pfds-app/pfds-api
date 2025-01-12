import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "src/controller";
import { UserService } from "src/service";
import { UserMapper } from "src/controller/mapper";
import { AuthModule } from "src/auth";
import { User } from "src/model";
import { NestjsFormDataModule } from "nestjs-form-data";
import { AssociationModule } from "./association.module";
import { RegionModule } from "./region.module";
import { CommitteeModule } from "./committee.module";
import { ResponsabilityModule } from "./responsability.module";
import { UserValidator } from "src/service/validator/user.validator";

@Module({
  imports: [
    NestjsFormDataModule,
    AssociationModule,
    RegionModule,
    CommitteeModule,
    ResponsabilityModule,
    AuthModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService, UserMapper, UserValidator],
  exports: [UserService, UserMapper, UserValidator],
})
export class UserModule {}
