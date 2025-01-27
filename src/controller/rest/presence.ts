import { ApiProperty } from "@nestjs/swagger";
import { Activity } from "./activity";
import { User } from "./user";

export class Presence {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty({ type: Activity })
  activity: Activity;

  @ApiProperty({ type: User })
  user: User;

  @ApiProperty({ format: "date-time" })
  createdAt: string;

  @ApiProperty({ format: "date-time" })
  updatedAt: string;
}
