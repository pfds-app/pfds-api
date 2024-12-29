import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleController } from "../controller";
import { RoleService } from "../service";
import { Role } from "src/model";
import { BasicAuthModule } from "./basic.auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Role]), BasicAuthModule],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule { }
