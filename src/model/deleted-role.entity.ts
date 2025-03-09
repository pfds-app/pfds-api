import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Role } from "./role.enum";
import { User } from "./user.entity";
import { User as RestUser } from "../controller/rest";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class DeletedRole {
  @ApiProperty()
  @PrimaryColumn()
  id: string;

  @Column({ type: "enum", enum: Role })
  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ format: "date-time" })
  @CreateDateColumn({
    name: "created_at",
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: string;

  @ApiProperty({ type: RestUser })
  @ManyToOne(() => User, {
    eager: true,
    onDelete: "CASCADE",
  })
  user: User;
}
