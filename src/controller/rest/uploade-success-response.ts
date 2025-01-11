import { ApiProperty } from "@nestjs/swagger";

export class UploadeSuccessResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  fileName: string;
}
