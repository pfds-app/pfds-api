import { DataSource, Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { v4 as uuid } from "uuid";

import { PayedTicket, Ticket, User } from "src/model";
import { PaginationParams } from "src/controller/decorators";
import { Criteria } from "./utils/criteria";
import { findByCriteria } from "./utils/find-by-cireria";
import { UPDATED_AT_CREATED_AT_ORDER_BY } from "./utils/default-order-by";
import { TicketStatus } from "./model";
import BigNumber from "bignumber.js";

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly repository: Repository<Ticket>,

    @InjectRepository(PayedTicket)
    private readonly payedTicketRepository: Repository<PayedTicket>,
    private readonly datasource: DataSource
  ) {}

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
          (ticket) => ticket.ticketNumber === ticketNumber
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

      if (pTicketsToDelete.length > 0) {
        await entityManager.delete(
          PayedTicket,
          pTicketsToDelete.map((payedTicket) => payedTicket.id)
        );
      }

      if (pTicketsToSave.length > 0) {
        await entityManager.save(PayedTicket, pTicketsToSave);
      }
      return createdTickets;
    });
  }

  async findOperationStaffs(operationId: string): Promise<User[]> {
    const tickets = await this.repository.find({
      where: {
        operation: {
          id: operationId,
        },
      },
    });

    return tickets.map((ticket) => ticket.staff);
  }
  async deleteById(id: string) {
    const toDelete = await this.findById(id);
    if (!toDelete) {
      throw new BadRequestException("No Ticket with id = " + id + " was found");
    }
    await this.repository.delete({ id });
    return toDelete;
  }

  async getOperationTicketStatus(
    operationId: string,
    pagination: PaginationParams
  ): Promise<TicketStatus[]> {
    const tickets = await this.findAll(pagination, {
      operation: {
        id: operationId,
      },
    });

    const ticketsStatus = tickets.map(async (ticket) => {
      const allPayedTicketsEntities = await this.payedTicketRepository.find({
        where: {
          ticket: {
            id: ticket.id,
          },
        },
      });
      const payedTickets = allPayedTicketsEntities.filter(
        (payedTicket) => payedTicket.isPayed
      );
      const numberOfPayedTickets = payedTickets.length;
      const numberOfNotPayedTickets =
        allPayedTicketsEntities.length - numberOfPayedTickets;

      const ticketStatus: TicketStatus = {
        ticket,
        payedAmount: new BigNumber(ticket.operation.ticketPrice)
          .multipliedBy(numberOfPayedTickets)
          .toString(),
        notPayedAmount: new BigNumber(ticket.operation.ticketPrice)
          .multipliedBy(numberOfNotPayedTickets)
          .toString(),
        numberOfTickets: payedTickets.length,
        pourcentageOfPayedTickets:
          (numberOfPayedTickets / allPayedTicketsEntities.length) * 100,
        pourcentageOfNotPayedTickets:
          (numberOfNotPayedTickets / allPayedTicketsEntities.length) * 100,
        numberOfPayedTickets,
        numberOfNotPayedTickets,
      };
      return ticketStatus;
    });

    return Promise.all(ticketsStatus);
  }
}
