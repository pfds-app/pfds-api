import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/model";

export class SignupPayload extends User {
  @ApiProperty()
  password: string;
}
