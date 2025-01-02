import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString, IsUUID } from "class-validator";

export class Event {
  @IsUUID()
  @ApiProperty({ format: "uuid" })
  id: string;

  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsString()
  place: string;

  @IsDateString()
  @ApiProperty()
  beginDate: string;

  @IsDateString()
  @ApiProperty()
  endDate: string;

  @IsDateString()
  @ApiProperty({ format: "date-time" })
  createdAt: string;

  @IsDateString()
  @ApiProperty({ format: "date-time" })
  updatedAt: string;
}
