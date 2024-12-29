import * as bcrypt from "bcrypt";
import { ApiProperty } from "@nestjs/swagger";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export enum UserGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

@Entity()
export class User {
  @PrimaryColumn()
  @ApiProperty({ format: "uuid" })
  id: string;

  @Column({ unique: true })
  @ApiProperty()
  email: string;

  @Column({ unique: true })
  @ApiProperty()
  username: string;

  @Column({ name: "first_name" })
  @ApiProperty()
  firstName: string;

  @Column({ name: "last_name" })
  @ApiProperty()
  lastName: string;

  @Column({ unique: true })
  @ApiProperty({ required: false })
  nic?: string;

  @Column()
  @ApiProperty({ required: false })
  photo?: string;

  @Column({ name: "birth_date", type: "date" })
  @ApiProperty({ format: "date" })
  birthDate: string;

  @Column()
  @ApiProperty()
  address: string;

  @Column({ type: "enum", enum: UserGender })
  @ApiProperty({ enum: UserGender })
  gender: UserGender;

  @Column()
  @ApiProperty({ required: false })
  apv?: string;

  @Column()
  password: string;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  @ApiProperty({ format: "date" })
  createdAt: string;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  @ApiProperty({ format: "date" })
  updatedAt: string;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
