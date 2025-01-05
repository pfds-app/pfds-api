import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Ticket, CrupdateTicket } from "../rest";
import { Ticket as TicketEntity } from "src/model";
import { OperationService, UserService } from "src/service";
import { OperationMapper } from "./operation.mapper";
import { UserMapper } from "./user.mapper";

@Injectable()
export class TicketMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly userService: UserService,
    private readonly operationMapper: OperationMapper,
    private readonly operationService: OperationService,
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>
  ) {}

  async toRest(ticket: TicketEntity): Promise<Ticket> {
    const operation = await this.operationMapper.toRest(ticket.operation);
    const staff = await this.userMapper.toRest(ticket.staff);

    return {
      ...ticket,
      operation,
      staff,
    };
  }

  async crupdateToDomain({
    operationId,
    staffId,
    ...baseEntityOperation
  }: CrupdateTicket): Promise<TicketEntity> {
    const operation = await this.operationService.findById(operationId);
    const staff = await this.userService.findById(staffId);

    if (!operation) {
      throw new BadRequestException(
        "Operation with id=" + operationId + " does not exist"
      );
    }

    if (!staff) {
      throw new BadRequestException(
        "Staff with id=" + staffId + " does not exist"
      );
    }

    return this.ticketRepository.create({
      staff,
      operation,
      ...baseEntityOperation,
    });
  }
}
