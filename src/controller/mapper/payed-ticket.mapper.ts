import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PayedTicket as EntityPayedTicket, Ticket } from "src/model";
import { PayedTicket } from "../rest";

@Injectable()
export class PayedTicketMapper {
  constructor(
    @InjectRepository(EntityPayedTicket)
    private readonly payedTicketRepository: Repository<EntityPayedTicket>,

    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>
  ) {}

  async toRest({
    ticket,
    ...basePayedTicket
  }: EntityPayedTicket): Promise<PayedTicket> {
    return { ...basePayedTicket, ticketId: ticket.id };
  }

  async toDomain({
    ticketId,
    ...entityPayedTicket
  }: PayedTicket): Promise<EntityPayedTicket> {
    const ticket = await this.ticketRepository.findOneBy({ id: ticketId });

    if (!ticket) {
      throw new BadRequestException(
        "No ticket with = " + ticketId + " was found"
      );
    }

    return this.payedTicketRepository.create({ ticket, ...entityPayedTicket });
  }
}
