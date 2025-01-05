import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PayedTicket } from "src/model";
import { PayedTicketMapper } from "src/controller/mapper";
import { PayedTicketController } from "src/controller";
import { PayedTicketService } from "src/service";

@Module({
  imports: [TypeOrmModule.forFeature([PayedTicket])],
  controllers: [PayedTicketController],
  providers: [PayedTicketService, PayedTicketMapper],
  exports: [PayedTicketService, PayedTicketMapper],
})
export class PayedTicketModule {}
