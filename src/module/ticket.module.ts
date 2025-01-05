import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Ticket } from "src/model";
import { TicketMapper } from "src/controller/mapper";
import { TicketController } from "src/controller";
import { TicketService } from "src/service";
import { UserModule } from "./user.module";
import { OperationModule } from "./operation.module";

@Module({
  imports: [UserModule, OperationModule, TypeOrmModule.forFeature([Ticket])],
  controllers: [TicketController],
  providers: [TicketService, TicketMapper],
  exports: [TicketService, TicketMapper],
})
export class TicketModule {}
