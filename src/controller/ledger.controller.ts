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
import { Raw } from "typeorm";

import { ApiCriteria, ApiJfds, ApiPagination } from "src/docs/decorators";
import { LedgerService, LedgerStatType } from "src/service";
import { Authenticated } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { Ledger } from "./rest";
import { LedgerMapper } from "./mapper";
import { Role } from "src/model";
import { LedgerStat } from "src/service/model";

@Controller()
@ApiTags("Moneys")
export class LedgerController {
  constructor(
    private readonly ledgerService: LedgerService,
    private readonly ledgerMapper: LedgerMapper
  ) {}

  @Get("/ledgers")
  @ApiPagination()
  @Authenticated()
  @ApiCriteria(
    { name: "name", type: "string" },
    { name: "year", type: "number" },
    { name: "month", type: "number", minimum: 1, maximum: 12 }
  )
  @ApiJfds({
    operationId: "getLedgers",
    type: [Ledger],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Query("name") name?: string,
    @Query("year") year?: number,
    @Query("month") month?: number
  ) {
    const ledgers = await this.ledgerService.findAll(pagination, {
      name,
      ledgerDate:
        month && year
          ? Raw(
              (alias) =>
                `EXTRACT(YEAR FROM ${alias}) = :year AND EXTRACT(MONTH FROM ${alias}) = :month`,
              { month, year }
            )
          : undefined,
    });
    return Promise.all(ledgers.map((role) => this.ledgerMapper.toRest(role)));
  }

  @Get("/ledgers/all/stats")
  @ApiJfds({
    type: [LedgerStat],
    operationId: "getLedgerStats",
  })
  @ApiCriteria(
    { name: "year", type: "number" },
    { name: "type", type: "string", enum: LedgerStatType }
  )
  async getLedgerStats(@Query("year") year?: number) {
    return this.ledgerService.getLedgerStatByYear(year);
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
  @Authenticated({ roles: [Role.ADMIN] })
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
  @Authenticated({ roles: [Role.ADMIN] })
  @ApiJfds({
    operationId: "deleteLedgerById",
    type: Ledger,
  })
  async deleteLedgerById(@Param("id") id: string) {
    const deletedLedger = await this.ledgerService.deleteById(id);
    return this.ledgerMapper.toRest(deletedLedger);
  }
}
