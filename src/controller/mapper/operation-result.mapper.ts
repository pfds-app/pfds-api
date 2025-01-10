import { Injectable } from "@nestjs/common";

import { OperationResult as TicketServiceEntity } from "src/service/model";
import { OperationResult } from "../rest";
import { OperationMapper } from "./operation.mapper";

@Injectable()
export class OperationResultMapper {
  constructor(private readonly ticketMapper: OperationMapper) {}

  async serviceToRest({
    operation,
    ...baseOperationResult
  }: TicketServiceEntity): Promise<OperationResult> {
    const mappedOperation = await this.ticketMapper.toRest(operation);

    return {
      operation: mappedOperation,
      ...baseOperationResult,
    };
  }
}
