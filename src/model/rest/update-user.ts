import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

import { UserGender } from "../user.entity";

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

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  nic?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  photo?: string;

  @IsDateString()
  @ApiProperty({ format: "date" })
  birthDate: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsEnum(UserGender)
  @ApiProperty({ enum: UserGender })
  gender: UserGender;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  apv?: string;

  @IsDateString()
  @ApiProperty({ format: "date" })
  createdAt: string;

  @IsDateString()
  @ApiProperty({ format: "date" })
  updatedAt: string;

  @IsUUID()
  @ApiProperty({ format: "uuid" })
  roleId: string;
}
