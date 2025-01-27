import { ApiProperty } from "@nestjs/swagger";
import { User } from "./user";

export class PresenceStatus {
  @ApiProperty({ type: User })
  user: User;

  @ApiProperty()
  isPresent: boolean;
}
