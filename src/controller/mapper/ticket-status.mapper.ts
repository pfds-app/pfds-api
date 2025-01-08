import { Injectable } from "@nestjs/common";

import { TicketStatus as TicketServiceEntity } from "src/service/model";
import { TicketStatus } from "../rest";
import { TicketMapper } from "./ticket.mapper";

@Injectable()
export class TicketStatusMapper {
  constructor(private readonly ticketMapper: TicketMapper) {}

  async serviceToRest({
    ticket,
    ...baseTicketStatus
  }: TicketServiceEntity): Promise<TicketStatus> {
    const mappedTicked = await this.ticketMapper.toRest(ticket);

    return {
      ticket: mappedTicked,
      ...baseTicketStatus,
    };
  }
}
