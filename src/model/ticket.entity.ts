import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Operation } from "./operation.entity";
import { User } from "./user.entity";

@Entity()
export class Ticket {
  @PrimaryColumn()
  id: string;

  @Column({ type: "int", name: "from_number" })
  fromNumber: number;

  @Column({ type: "int", name: "to_number" })
  toNumber: number;

  @ManyToOne(() => Operation, {
    eager: true,
    nullable: false,
    onDelete: "CASCADE",
  })
  operation: Operation;

  @ManyToOne(() => User, { eager: true, nullable: false, onDelete: "CASCADE" })
  staff: User;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: string;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: string;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;
}
