import { ApiProperty } from "@nestjs/swagger";
import { Operation } from "./operation";

export class OperationResult {
  @ApiProperty({ type: Operation })
  operation: Operation;

  @ApiProperty()
  numberOfDistributed: number;

  @ApiProperty()
  sumOfDistributed: string;
}
