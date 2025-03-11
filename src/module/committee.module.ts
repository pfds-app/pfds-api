import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Committee } from "src/model";
import { CommitteeMapper } from "src/controller/mapper";
import { CommitteeController } from "src/controller";
import { CommitteeService } from "src/service";
import { AuthModule } from "src/auth";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Committee])],
  controllers: [CommitteeController],
  providers: [CommitteeService, CommitteeMapper],
  exports: [CommitteeService, CommitteeMapper],
})
export class CommitteeModule {}
