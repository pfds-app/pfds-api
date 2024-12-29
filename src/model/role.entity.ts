import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Role {
  @PrimaryColumn()
  @ApiProperty({ format: "uuid" })
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @ApiProperty({ format: "date" })
  createdAt: string;
}
