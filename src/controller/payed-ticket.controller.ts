import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";

import { ApiJfds, ApiPagination } from "src/docs/decorators";
import { PayedTicketService } from "src/service";
import { Authenticated } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { PayedTicket } from "./rest";
import { PayedTicketMapper } from "./mapper";

@Controller()
@ApiTags("Moneys")
export class PayedTicketController {
  constructor(
    private readonly payedTiketService: PayedTicketService,
    private readonly payedTiketMapper: PayedTicketMapper
  ) { }

  @Get("/operation/:operationId/staffs/:staffId/payed-tickets")
  @ApiPagination()
  @Authenticated()
  @ApiJfds({
    operationId: "getPayedTickets",
    type: [PayedTicket],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Param("operationId") operationId: string,
    @Param("staffId") staffId: string
  ) {
    const payedTikets = await this.payedTiketService.findAll(pagination, {
      ticket: {
        operation: {
          id: operationId,
        },
        staff: {
          id: staffId,
        },
      },
    });
    return Promise.all(
      payedTikets.map((role) => this.payedTiketMapper.toRest(role))
    );
  }

  @Get("/operation/:operationId/tickets/:ticketNumber")
  @Authenticated()
  @ApiJfds({
    operationId: "getOperationTicketByTicketNumber",
    type: PayedTicket,
  })
  async findOperationTicketByTicketNumber(
    @Param("operationId") operationId: string,
    @Param("ticketNumber") ticketNumber: number
  ) {
    const payedTikets = await this.payedTiketService.findAll({ page: 1, pageSize: 1 }, {
      ticket: {
        operation: {
          id: operationId,
        },
      },
      ticketNumber
    });
    return payedTikets[0] ?? null;
  }

  @Put("/operation/:operationId/staffs/:staffId/payed-tickets")
  @Authenticated()
  @ApiBody({ type: [PayedTicket] })
  @ApiJfds({
    operationId: "crupdatePayedTickets",
    type: [PayedTicket],
  })
  async crupdatePayedTickets(
    @Param("operationId") _operationId: string,
    @Param("staffId") _staffId: string,
    @Body() payedTikets: PayedTicket[]
  ) {
    const mapped = await Promise.all(
      payedTikets.map((payedTiket) =>
        this.payedTiketMapper.toDomain(payedTiket)
      )
    );

    const savedPayedTickets =
      await this.payedTiketService.savePayedTickets(mapped);

    return Promise.all(
      savedPayedTickets.map((payedTiket) =>
        this.payedTiketMapper.toRest(payedTiket)
      )
    );
  }
}
