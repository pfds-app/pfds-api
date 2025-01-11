import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "src/controller";
import { UserService } from "src/service";
import { UserMapper } from "src/controller/mapper";
import { AuthModule } from "src/auth";
import { User } from "src/model";
import { RoleModule } from "./role.module";
import { NestjsFormDataModule } from "nestjs-form-data";

@Module({
  imports: [
    NestjsFormDataModule,
    RoleModule,
    AuthModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService, UserMapper],
  exports: [UserService, UserMapper],
})
export class UserModule {}
