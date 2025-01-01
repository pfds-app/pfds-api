import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString, IsUUID } from "class-validator";

export class Role {
  @IsUUID()
  @ApiProperty({ format: "uuid" })
  id: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsDateString()
  @ApiProperty({ format: "date" })
  createdAt: string;

  @IsDateString()
  @ApiProperty({ format: "date" })
  updatedAt: string;
}
