import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { Role, UserGender } from "src/model";

export class UpdateUser {
  @IsUUID()
  @ApiProperty({ format: "uuid" })
  id: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsDateString()
  @ApiProperty({ format: "date" })
  birthDate: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsEnum(UserGender)
  @ApiProperty({ enum: UserGender })
  gender: UserGender;

  @IsEnum(Role)
  @ApiProperty({ enum: Role })
  role: Role;

  @IsDateString()
  @ApiProperty({ format: "date-time" })
  createdAt: string;

  @IsDateString()
  @ApiProperty({ format: "date-time" })
  updatedAt: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  nic?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  apv?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ format: "uuid", required: false })
  responsabilityId?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ format: "uuid", required: false })
  regionId?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ format: "uuid", required: false })
  committeeId?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ format: "uuid", required: false })
  associationId?: string;
}
