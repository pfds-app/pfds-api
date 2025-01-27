import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsUUID } from "class-validator";

export class CreatePresence {
  @IsUUID()
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty({ format: "uuid" })
  @IsUUID()
  activityId: string;

  @ApiProperty({ format: "uuid" })
  @IsUUID()
  userId: string;

  @ApiProperty({ format: "date-time" })
  @IsDateString()
  createdAt: string;

  @ApiProperty({ format: "date-time" })
  @IsDateString()
  updatedAt: string;
}
