import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RoleController } from "../controller";
import { RoleService } from "../service";
import { Role } from "src/model";
import { AuthModule } from "src/auth";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
