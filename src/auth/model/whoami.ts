import { ApiProperty } from "@nestjs/swagger";
import { RestUser } from "src/model/rest";

export class Whoami extends RestUser {
  @ApiProperty()
  token: string;
}
