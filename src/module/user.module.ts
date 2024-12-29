import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "../controller";
import { UserService } from "../service";
import { User } from "src/model";
import { BasicAuthModule } from "./basic.auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), BasicAuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
