import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString, IsUUID } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Role {
  @IsUUID()
  @PrimaryColumn()
  @ApiProperty({ format: "uuid" })
  id: string;

  @IsString()
  @Column()
  @ApiProperty()
  name: string;

  @IsDateString()
  @CreateDateColumn({
    name: "created_at",
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  @ApiProperty({ format: "date" })
  createdAt: string;

  @IsDateString()
  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  @ApiProperty({ format: "date" })
  updatedAt: string;
}
