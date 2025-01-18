import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Ticket } from "./ticket.entity";

@Entity()
export class PayedTicket {
  @PrimaryColumn()
  id: string;

  @Column({ type: "int", name: "ticket_number" })
  ticketNumber: number;

  @Column({ type: "boolean", name: "is_payed" })
  isPayed: boolean;

  @Column({ type: "boolean", name: "is_distributed" })
  isDistributed: boolean;

  @ManyToOne(() => Ticket, {
    eager: true,
    nullable: false,
    onDelete: "CASCADE",
  })
  ticket: Ticket;

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
}
