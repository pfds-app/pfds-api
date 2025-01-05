import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsUUID, Min } from "class-validator";

export class CrupdateTicket {
  @IsUUID()
  @ApiProperty({ format: "uuid" })
  id: string;

  @IsNumber()
  @Min(1)
  @ApiProperty()
  fromNumber: number;

  @IsNumber()
  @Min(2)
  @ApiProperty()
  toNumber: number;

  @IsUUID()
  @ApiProperty({ format: "uuid" })
  operationId: string;

  @IsUUID()
  @ApiProperty({ format: "uuid" })
  staffId: string;

  @IsDateString()
  @ApiProperty({ format: "date-time" })
  createdAt: string;

  @IsDateString()
  @ApiProperty({ format: "date-time" })
  updatedAt: string;
}
