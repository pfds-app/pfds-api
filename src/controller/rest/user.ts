import { ApiProperty } from "@nestjs/swagger";

import { Role, Sacrament, UserGender } from "src/model";
import { Committee } from "./committee";
import { Association } from "./association";
import { Region } from "./region";
import { Responsability } from "./responsability";

export class User {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ format: "date" })
  birthDate: string;

  @ApiProperty()
  address: string;

  @ApiProperty({ enum: UserGender })
  gender: UserGender;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ format: "date-time" })
  createdAt: string;

  @ApiProperty({ format: "date-time" })
  updatedAt: string;

  @ApiProperty({ required: false })
  nic?: string;

  @ApiProperty({ required: false })
  photo?: string;

  @ApiProperty({ required: false })
  apv?: string;

  @ApiProperty({ type: Responsability, required: false })
  responsability?: Responsability;

  @ApiProperty({ type: Committee, required: false })
  committee?: Committee;

  @ApiProperty({ type: Region, required: false })
  region?: Region;

  @ApiProperty({ type: Association, required: false })
  association?: Association;

  @ApiProperty({ type: Sacrament, required: false })
  sacrament?: Sacrament;
}
