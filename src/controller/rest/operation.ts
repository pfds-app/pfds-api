import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsNumber,
  IsNumberString,
  IsString,
  IsUUID,
  Min,
} from "class-validator";

export class Operation {
  @IsUUID()
  @ApiProperty({ format: "uuid" })
  id: string;

  @IsString()
  @ApiProperty()
  name: string;

  @Min(1)
  @IsNumber()
  @ApiProperty({ minimum: 1 })
  numberOfTickets: number;

  @IsNumberString()
  @ApiProperty()
  ticketPrice: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsDateString()
  @ApiProperty({ format: "date" })
  operationDate: string;

  @IsDateString()
  @ApiProperty({ format: "date-time" })
  createdAt: string;

  @IsDateString()
  @ApiProperty({ format: "date-time" })
  updatedAt: string;
}
