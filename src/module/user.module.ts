import { Module } from "@nestjs/common";
import { UserController } from "../controller/user.controller";
import { UserService } from "../service/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/model/user.entity";
import { BasicAuthModule } from "./basic.auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), BasicAuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
