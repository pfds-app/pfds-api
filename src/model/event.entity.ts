import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Event {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  place: string;

  @Column({ type: "date", name: "begin_date" })
  beginDate: string;

  @Column({ type: "date", name: "end_date" })
  endDate: string;

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
