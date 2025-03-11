import { ApiProperty } from "@nestjs/swagger";

export class Count {
  @ApiProperty({ type: "number" })
  value: number;
}
