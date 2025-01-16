import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/model";

export class SigninByRole {
  @ApiProperty()
  role: Role;

  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  responsabilityId?: string;

  @ApiProperty()
  committeeId?: string;

  @ApiProperty()
  associationId?: string;

  @ApiProperty()
  regionId?: string;
}
