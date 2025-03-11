import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PayedTicket, Ticket } from "src/model";
import { PayedTicketMapper } from "src/controller/mapper";
import { PayedTicketController } from "src/controller";
import { PayedTicketService } from "src/service";
import { AuthModule } from "src/auth";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([PayedTicket, Ticket])],
  controllers: [PayedTicketController],
  providers: [PayedTicketService, PayedTicketMapper],
  exports: [PayedTicketService, PayedTicketMapper],
})
export class PayedTicketModule {}
