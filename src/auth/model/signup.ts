import { ApiProperty } from "@nestjs/swagger";
import { CreateUser } from "src/controller/rest";

export class SignupPayload extends CreateUser {
  @ApiProperty()
  adminApiKey: string;
}
