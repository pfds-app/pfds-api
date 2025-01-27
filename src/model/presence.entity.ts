import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Activity } from "./activity.entity";
import { User } from "./user.entity";

@Entity()
export class Presence {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => Activity, {
    eager: true,
    nullable: false,
    onDelete: "CASCADE",
  })
  activity: Activity;

  @ManyToOne(() => User, {
    eager: true,
    nullable: false,
    onDelete: "CASCADE",
  })
  user: User;

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
