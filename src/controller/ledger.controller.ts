import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";

import { ApiCriteria, ApiJfds, ApiPagination } from "src/docs/decorators";
import { LedgerService } from "src/service";
import { Authenticated } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { Ledger } from "./rest";
import { LedgerMapper } from "./mapper";

@Controller()
@ApiTags("Ledgers")
export class LedgerController {
  constructor(
    private readonly ledgerService: LedgerService,
    private readonly ledgerMapper: LedgerMapper
  ) {}

  @Get("/ledgers")
  @ApiPagination()
  @Authenticated()
  @ApiCriteria({ name: "name", type: "string" })
  @ApiJfds({
    operationId: "getLedgers",
    type: [Ledger],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Query("name") name?: string
  ) {
    const ledgers = await this.ledgerService.findAll(pagination, {
      name,
    });
    return Promise.all(ledgers.map((role) => this.ledgerMapper.toRest(role)));
  }

  @Get("/ledgers/:id")
  @Authenticated()
  @ApiJfds({
    operationId: "getLedgerById",
    type: Ledger,
  })
  async findById(@Param("id") id: string) {
    const ledger = await this.ledgerService.findById(id);
    if (!ledger) {
      throw new NotFoundException();
    }
    return this.ledgerMapper.toRest(ledger);
  }

  @Put("/ledgers")
  @Authenticated()
  @ApiBody({ type: [Ledger] })
  @ApiJfds({
    operationId: "crupdateLedgers",
    type: [Ledger],
  })
  async crupdateLedgers(@Body() ledgers: Ledger[]) {
    const mapped = await Promise.all(
      ledgers.map((ledger) => this.ledgerMapper.toDomain(ledger))
    );
    const savedLedgers = await this.ledgerService.saveLedgers(mapped);
    return Promise.all(
      savedLedgers.map((ledger) => this.ledgerMapper.toRest(ledger))
    );
  }

  @Delete("/ledgers/:id")
  @Authenticated()
  @ApiJfds({
    operationId: "deleteLedgerById",
    type: Ledger,
  })
  async deleteLedgerById(@Param("id") id: string) {
    const deletedLedger = await this.ledgerService.deleteById(id);
    return this.ledgerMapper.toRest(deletedLedger);
  }
}
