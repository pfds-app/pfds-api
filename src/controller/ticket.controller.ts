import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";

import { ApiJfds, ApiPagination } from "src/docs/decorators";
import { TicketService } from "src/service";
import { Authenticated } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { CrupdateTicket, OperationResult, Ticket } from "./rest";
import {
  OperationResultMapper,
  TicketMapper,
  TicketStatusMapper,
  UserMapper,
} from "./mapper";
import { User, TicketStatus } from "./rest";
import { Role } from "src/model";

@Controller()
@ApiTags("Moneys")
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly ticketMapper: TicketMapper,
    private readonly userMapper: UserMapper,
    private readonly ticketStatusMapper: TicketStatusMapper,
    private readonly operationResultMapper: OperationResultMapper
  ) {}

  @Get("/operations/results/all")
  @ApiPagination()
  @Authenticated({ roles: [Role.ADMIN] })
  @ApiJfds({
    operationId: "getOperationResults",
    type: [OperationResult],
  })
  async getOperationResults(@Pagination() pagination: PaginationParams) {
    const operationResults =
      await this.ticketService.getOperationResults(pagination);
    return Promise.all(
      operationResults.map((operationResult) =>
        this.operationResultMapper.serviceToRest(operationResult)
      )
    );
  }

  @Get("/operations/:operationId/staffs")
  @Authenticated({ roles: [Role.ADMIN] })
  @ApiJfds({
    operationId: "getAllOperationStaffs",
    type: [User],
  })
  async getAllOperationStaffs(@Param("operationId") operationId: string) {
    const users = await this.ticketService.findOperationStaffs(operationId);
    return Promise.all(users.map((user) => this.userMapper.toRest(user)));
  }

  @Get("/operations/:operationId/tickets/status")
  @Authenticated({ roles: [Role.ADMIN] })
  @ApiPagination()
  @ApiJfds({
    operationId: "getAllOperationTicketsStatus",
    type: [TicketStatus],
  })
  async getAllOperationTicketsStatus(
    @Pagination() pagination: PaginationParams,
    @Param("operationId") operationId: string
  ) {
    const results = await this.ticketService.getOperationTicketStatus(
      operationId,
      pagination
    );
    return Promise.all(
      results.map((ticketStatus) =>
        this.ticketStatusMapper.serviceToRest(ticketStatus)
      )
    );
  }

  @Get("/tickets")
  @ApiPagination()
  @Authenticated({ roles: [Role.ADMIN] })
  @ApiJfds({
    operationId: "getTickets",
    type: [Ticket],
  })
  async findAll(@Pagination() pagination: PaginationParams) {
    const tickets = await this.ticketService.findAll(pagination, {});
    return Promise.all(tickets.map((role) => this.ticketMapper.toRest(role)));
  }

  @Get("/tickets/:id")
  @Authenticated({ roles: [Role.ADMIN] })
  @ApiJfds({
    operationId: "getTicketById",
    type: Ticket,
  })
  async findById(@Param("id") id: string) {
    const ticket = await this.ticketService.findById(id);
    if (!ticket) {
      throw new NotFoundException();
    }
    return this.ticketMapper.toRest(ticket);
  }

  @Put("/tickets")
  @Authenticated({ roles: [Role.ADMIN] })
  @ApiBody({ type: [CrupdateTicket] })
  @ApiJfds({
    operationId: "crupdateTickets",
    type: [Ticket],
  })
  async crupdateTickets(@Body() tickets: CrupdateTicket[]) {
    const mapped = await Promise.all(
      tickets.map((ticket) => this.ticketMapper.crupdateToDomain(ticket))
    );
    const savedTickets = await this.ticketService.saveTickets(mapped);
    return Promise.all(
      savedTickets.map((ticket) => this.ticketMapper.toRest(ticket))
    );
  }

  @Delete("/tickets/:id")
  @Authenticated({ roles: [Role.ADMIN] })
  @ApiJfds({
    operationId: "deleteTicketById",
    type: Ticket,
  })
  async deleteTicketById(@Param("id") id: string) {
    const deletedTicket = await this.ticketService.deleteById(id);
    return this.ticketMapper.toRest(deletedTicket);
  }
}
