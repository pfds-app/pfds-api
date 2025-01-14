import { ApiProperty } from "@nestjs/swagger";

export class UserStat {
  @ApiProperty()
  year: number;

  @ApiProperty()
  maleCount: number;

  @ApiProperty()
  femaleCount: number;

  @ApiProperty()
  totalCount: number;
}
