import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PayedTicket, Ticket } from "src/model";
import { TicketMapper, TicketStatusMapper } from "src/controller/mapper";
import { TicketController } from "src/controller";
import { TicketService } from "src/service";
import { UserModule } from "./user.module";
import { OperationModule } from "./operation.module";
import { PayedTicketModule } from "./payed-ticket.module";

@Module({
  imports: [
    PayedTicketModule,
    UserModule,
    OperationModule,
    TypeOrmModule.forFeature([Ticket, PayedTicket]),
  ],
  controllers: [TicketController],
  providers: [TicketService, TicketMapper, TicketStatusMapper],
  exports: [TicketService, TicketMapper, TicketStatusMapper],
})
export class TicketModule {}
