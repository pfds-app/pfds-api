import { Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { PayedTicket } from "src/model";
import { PaginationParams } from "src/controller/decorators";
import { findByCriteria } from "./utils/find-by-cireria";
import { Criteria } from "./utils/criteria";

@Injectable()
export class PayedTicketService {
  constructor(
    @InjectRepository(PayedTicket)
    private readonly repository: Repository<PayedTicket>
  ) {}

  async findAll(pagination: PaginationParams, criteria: Criteria<PayedTicket>) {
    return findByCriteria<PayedTicket>({
      repository: this.repository,
      criteria,
      pagination,
      order: {
        ticketNumber: "ASC",
      },
    });
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async savePayedTickets(payedTikets: PayedTicket[]) {
    return this.repository.save(payedTikets);
  }

  async deleteById(id: string) {
    const toDelete = await this.findById(id);
    if (!toDelete) {
      throw new BadRequestException(
        "No PayedTicket with id = " + id + " was found"
      );
    }
    await this.repository.softDelete({ id });
    return toDelete;
  }
}
