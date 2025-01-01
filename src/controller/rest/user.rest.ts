import { ApiProperty } from "@nestjs/swagger";

import { UserGender } from "src/model";
import { Role } from "./role";

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

  @ApiProperty({ format: "date" })
  createdAt: string;

  @ApiProperty({ format: "date" })
  updatedAt: string;

  @ApiProperty({ type: Role })
  role: Role;
}
