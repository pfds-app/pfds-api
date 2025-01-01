import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Role } from "src/model";
import { RoleMapper } from "src/controller/mapper";
import { RoleController } from "src/controller";
import { RoleService } from "src/service";

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService, RoleMapper],
  exports: [RoleService, RoleMapper],
})
export class RoleModule {}
