import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PayedTicket, Ticket } from "src/model";
import {
  OperationResultMapper,
  TicketMapper,
  TicketStatusMapper,
} from "src/controller/mapper";
import { TicketController } from "src/controller";
import { TicketService } from "src/service";
import { UserModule } from "./user.module";
import { OperationModule } from "./operation.module";
import { PayedTicketModule } from "./payed-ticket.module";
import { AuthModule } from "src/auth";

@Module({
  imports: [
    AuthModule,
    PayedTicketModule,
    UserModule,
    OperationModule,
    TypeOrmModule.forFeature([Ticket, PayedTicket]),
  ],
  controllers: [TicketController],
  providers: [
    TicketService,
    TicketMapper,
    TicketStatusMapper,
    OperationResultMapper,
  ],
  exports: [
    TicketService,
    TicketMapper,
    TicketStatusMapper,
    OperationResultMapper,
  ],
})
export class TicketModule {}
