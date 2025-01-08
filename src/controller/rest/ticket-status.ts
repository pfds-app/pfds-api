import { ApiProperty } from "@nestjs/swagger";
import { Ticket } from "./ticket";

export class TicketStatus {
  @ApiProperty({ type: Ticket })
  ticket: Ticket;

  @ApiProperty()
  numberOfTickets: number;

  @ApiProperty()
  numberOfPayedTickets: number;

  @ApiProperty()
  numberOfNotPayedTickets: number;

  @ApiProperty()
  pourcentageOfPayedTickets: number;

  @ApiProperty()
  pourcentageOfNotPayedTickets: number;

  @ApiProperty()
  notPayedAmount: string;

  @ApiProperty()
  payedAmount: string;
}
