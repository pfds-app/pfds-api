import { ApiProperty } from "@nestjs/swagger";
import { UpdateUser } from "./update-user";
import { MinLength } from "class-validator";

export class CreateUser extends UpdateUser {
  @ApiProperty()
  @MinLength(8)
  password: string;
}
