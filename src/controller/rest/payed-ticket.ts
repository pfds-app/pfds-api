import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsUUID,
  Min,
} from "class-validator";

export class PayedTicket {
  @IsUUID()
  @ApiProperty({ format: "uuid" })
  id: string;

  @Min(1)
  @IsNumber()
  @ApiProperty({ type: "number", minimum: 1 })
  ticketNumber: string;

  @IsUUID()
  @ApiProperty({ format: "uuid" })
  ticketId: string;

  @IsBoolean()
  @ApiProperty()
  isPayed: boolean;

  @IsDateString()
  @ApiProperty({ format: "date-time" })
  createdAt: string;

  @IsDateString()
  @ApiProperty({ format: "date-time" })
  updatedAt: string;
}
