import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Role {
  @PrimaryColumn()
  @ApiProperty({ format: "uuid" })
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp without time zone", default: () => "CURRENT_TIMESTAMP" })
  @ApiProperty({ format: "date" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp without time zone", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  @ApiProperty({ format: "date" })
  updatedAt: string;
}
