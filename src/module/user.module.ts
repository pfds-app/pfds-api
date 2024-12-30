import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "../controller";
import { UserService } from "../service";
import { User } from "src/model";
import { UserMapper } from "src/model/mapper";
import { AuthModule } from "src/auth";
import { RoleModule } from "./role.module";

@Module({
  imports: [RoleModule, AuthModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserMapper],
  exports: [UserService, UserMapper],
})
export class UserModule {}
