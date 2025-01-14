import { ApiProperty } from "@nestjs/swagger";

export class UserGenderStat {
  @ApiProperty()
  year: number;

  @ApiProperty()
  maleCount: number;

  @ApiProperty()
  femaleCount: number;
}
