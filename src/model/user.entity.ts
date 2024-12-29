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
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";

export enum UserGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

@Entity()
export class User {
  @IsUUID()
  @PrimaryColumn()
  @ApiProperty({ format: "uuid" })
  id: string;

  @IsEmail()
  @Column({ unique: true })
  @ApiProperty()
  email: string;

  @IsString()
  @Column({ unique: true })
  @ApiProperty()
  username: string;

  @IsString()
  @Column({ name: "first_name" })
  @ApiProperty()
  firstName: string;

  @IsString()
  @Column({ name: "last_name" })
  @ApiProperty()
  lastName: string;

  @IsOptional()
  @IsString()
  @Column({ unique: true })
  @ApiProperty({ required: false })
  nic?: string;

  @IsOptional()
  @IsString()
  @Column()
  @ApiProperty({ required: false })
  photo?: string;

  @IsDateString()
  @Column({ name: "birth_date", type: "date" })
  @ApiProperty({ format: "date" })
  birthDate: string;

  @IsString()
  @Column()
  @ApiProperty()
  address: string;

  @IsEnum(UserGender)
  @Column({ type: "enum", enum: UserGender })
  @ApiProperty({ enum: UserGender })
  gender: UserGender;

  @Column()
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  apv?: string;

  @Column()
  @IsString()
  @MinLength(8)
  password: string;

  @IsDateString()
  @CreateDateColumn({
    name: "created_at",
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  @ApiProperty({ format: "date" })
  createdAt: string;

  @IsDateString()
  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  @ApiProperty({ format: "date" })
  updatedAt: string;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.hashPassword();
  }

  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
