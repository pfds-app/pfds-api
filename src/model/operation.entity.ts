import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Operation {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ type: "int", name: "number_of_tickets" })
  numberOfTickets: number;

  @Column({ type: "decimal", precision: 16, scale: 10, name: "ticket_price" })
  ticketPrice: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "date", name: "operation_date" })
  operationDate: string;

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
