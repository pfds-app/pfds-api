import { ApiProperty } from "@nestjs/swagger";

import { UserGender } from "src/model";
import { Role } from "./role";
import { Committee } from "./committee";
import { Association } from "./association";
import { Region } from "./region";

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

  @ApiProperty({ required: false })
  nic?: string;

  @ApiProperty({ required: false })
  photo?: string;

  @ApiProperty({ format: "date" })
  birthDate: string;

  @ApiProperty()
  address: string;

  @ApiProperty({ enum: UserGender })
  gender: UserGender;

  @ApiProperty({ required: false })
  apv?: string;

  @ApiProperty({ format: "date-time" })
  createdAt: string;

  @ApiProperty({ format: "date-time" })
  updatedAt: string;

  @ApiProperty({ type: Role })
  role: Role;

  @ApiProperty({ type: Committee })
  committee: Committee;

  @ApiProperty({ type: Region })
  region: Region;

  @ApiProperty({ type: Association })
  association: Association;
}
