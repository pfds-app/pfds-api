import { ApiProperty } from "@nestjs/swagger";

export class SigninPayload {
  @ApiProperty()
  password: string;

  @ApiProperty()
  username: string;
}
