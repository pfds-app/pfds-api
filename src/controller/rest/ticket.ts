import { ApiProperty } from "@nestjs/swagger";
import { Operation } from "./operation";
import { User } from "./user";

export class Ticket {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty()
  fromNumber: number;

  @ApiProperty()
  toNumber: number;

  @ApiProperty({ type: Operation })
  operation: Operation;

  @ApiProperty({ type: User })
  staff: User;

  @ApiProperty({ format: "date-time" })
  createdAt: string;

  @ApiProperty({ format: "date-time" })
  updatedAt: string;
}
