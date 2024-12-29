import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";
import { User } from "src/model";

export class SignupPayload extends User {
  @IsString()
  @MinLength(8)
  @ApiProperty()
  password: string;
}
