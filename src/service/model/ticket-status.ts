import { Ticket } from "src/model";

export class TicketStatus {
  ticket: Ticket;
  numberOfTickets: number;
  numberOfPayedTickets: number;
  numberOfNotPayedTickets: number;
  pourcentageOfPayedTickets: number;
  pourcentageOfNotPayedTickets: number;
  notPayedAmount: string;
  payedAmount: string;
}
