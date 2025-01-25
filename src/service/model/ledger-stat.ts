import { ApiProperty } from "@nestjs/swagger";

export class LedgerStat {
  @ApiProperty()
  count: string;

  @ApiProperty()
  month: number;
}
