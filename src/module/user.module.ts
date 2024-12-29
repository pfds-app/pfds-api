import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "../controller";
import { UserService } from "../service";
import { User } from "src/model";
import { UserMapper } from "src/model/mapper";
import { AuthModule } from "src/auth";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserMapper],
})
export class UserModule {}
