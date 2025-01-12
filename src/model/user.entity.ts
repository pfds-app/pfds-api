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
import { Role } from "./role.enum";
import { Region } from "./region.entity";
import { Committee } from "./committee.entity";
import { Association } from "./association.entity";
import { UserGender } from "./user-genger.enum";
import { Responsability } from "./responsability.entity";

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

  @Column({ unique: true, nullable: true })
  nic?: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ name: "birth_date", type: "date" })
  birthDate: string;

  @Column()
  address: string;

  @Column({ type: "enum", enum: UserGender })
  gender: UserGender;

  @Column({ nullable: true })
  apv?: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: Role })
  role: Role;

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

  @ManyToOne(() => Region, {
    eager: true,
    nullable: true,
    onDelete: "CASCADE",
  })
  region?: Region;

  @ManyToOne(() => Committee, {
    eager: true,
    nullable: true,
    onDelete: "CASCADE",
  })
  committee?: Committee;

  @ManyToOne(() => Association, {
    eager: true,
    nullable: true,
    onDelete: "CASCADE",
  })
  association?: Association;

  @ManyToOne(() => Responsability, {
    eager: true,
    nullable: true,
    onDelete: "CASCADE",
  })
  responsability?: Responsability;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    await this.hashPassword();
  }

  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
