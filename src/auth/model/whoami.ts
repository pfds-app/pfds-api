import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/controller/rest";

export class Whoami extends User {
  @ApiProperty()
  token: string;
}
