import { DataSource, Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { v4 as uuid } from "uuid";

import { PayedTicket, Ticket } from "src/model";
import { PaginationParams } from "src/controller/decorators";
import { Criteria } from "./utils/criteria";
import { findByCriteria } from "./utils/find-by-cireria";
import { UPDATED_AT_CREATED_AT_ORDER_BY } from "./utils/default-order-by";

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly repository: Repository<Ticket>,

    @InjectRepository(PayedTicket)
    private readonly payedTicketRepository: Repository<PayedTicket>,

    private readonly datasource: DataSource
  ) { }

  async findAll(pagination: PaginationParams, criteria: Criteria<Ticket>) {
    return findByCriteria<Ticket>({
      repository: this.repository,
      criteria,
      pagination,
      order: UPDATED_AT_CREATED_AT_ORDER_BY,
    });
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async saveTickets(tickets: Ticket[]) {
    if (tickets.length !== 1) {
      throw new BadRequestException(
        "Creating Many tickets is not supported yet !"
      );
    }
    const [ticket] = tickets;
    if (ticket.fromNumber > ticket.toNumber) {
      throw new BadRequestException(
        "fromNumber must be less or equal than toNumber"
      );
    }

    const pTicketsSaved = await this.payedTicketRepository.find({
      where: {
        ticket: {
          id: ticket.id,
        },
      },
    });

    const pTicketsToDelete = pTicketsSaved.filter(
      (payedTicket) =>
        payedTicket.ticketNumber < ticket.fromNumber ||
        payedTicket.ticketNumber > ticket.toNumber
    );
    const pTicketsToSave: PayedTicket[] = new Array(
      ticket.toNumber - ticket.fromNumber + 1
    )
      .fill(0)
      .map((_, index) => {
        const ticketNumber = ticket.fromNumber + index;
        const toSave = pTicketsSaved.find(
          (ticket) => ticket.ticketNumber == ticketNumber
        );
        return (
          toSave ??
          this.payedTicketRepository.create({
            ticket,
            id: uuid(),
            ticketNumber,
            isPayed: false,
            createdAt: ticket.updatedAt,
            updatedAt: ticket.updatedAt,
          })
        );
      });

    return await this.datasource.transaction(async (entityManager) => {
      const createdTickets = [await entityManager.save(Ticket, ticket)];
      await entityManager.delete(
        PayedTicket,
        pTicketsToDelete.map((payedTicket) => payedTicket.id)
      );
      await entityManager.save(PayedTicket, pTicketsToSave);

      return createdTickets;
    });
  }

  async deleteById(id: string) {
    const toDelete = await this.findById(id);
    if (!toDelete) {
      throw new BadRequestException("No Ticket with id = " + id + " was found");
    }
    await this.repository.delete({ id });
    return toDelete;
  }
}
