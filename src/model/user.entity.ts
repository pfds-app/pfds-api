import * as bcrypt from "bcrypt";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Role } from "./role.entity";

export enum UserGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column({ unique: true })
  nic?: string;

  @Column()
  photo?: string;

  @Column({ name: "birth_date", type: "date" })
  birthDate: string;

  @Column()
  address: string;

  @Column({ type: "enum", enum: UserGender })
  gender: UserGender;

  @Column()
  apv?: string;

  @Column()
  password: string;

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

  @ManyToOne(() => Role, { eager: true, nullable: false, onDelete: "CASCADE" })
  role: Role;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    await this.hashPassword();
  }

  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
