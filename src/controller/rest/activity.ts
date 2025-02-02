import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsString, IsUUID } from "class-validator";
import { ActivityRoleType, Role } from "src/model";

export class Activity {
  @IsUUID()
  @ApiProperty({ format: "uuid" })
  id: string;

  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty()
  place: string;

  @IsDateString()
  @ApiProperty()
  beginDate: string;

  @IsDateString()
  @ApiProperty()
  endDate: string;

  @ApiProperty({ type: "string" })
  description: string;

  @IsEnum(ActivityRoleType)
  @ApiProperty({ enum: ActivityRoleType })
  roleType: ActivityRoleType;

  @IsEnum(Role)
  @ApiProperty({ enum: Role })
  organisatorRole: Role;

  @IsDateString()
  @ApiProperty({ format: "date-time" })
  createdAt: string;

  @IsDateString()
  @ApiProperty({ format: "date-time" })
  updatedAt: string;
}
