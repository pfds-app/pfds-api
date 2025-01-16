import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { ActivityRoleType } from "./activity-role-type.enum";
import { Role } from "./role.enum";

@Entity()
export class Activity {
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

  @Column({ type: "text" })
  description: string;

  @Column({ type: "enum", enum: ActivityRoleType })
  roleType: ActivityRoleType;

  @Column({ type: "enum", enum: Role, name: "role_organisator" })
  organisatorRole: Role;

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
