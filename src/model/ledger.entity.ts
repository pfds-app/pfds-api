import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export enum LedgerMouvementType {
  IN = "IN",
  OUT = "OUT",
}

@Entity()
export class Ledger {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ type: "date", name: "ledger_date" })
  ledgerDate: string;

  @Column({ type: "enum", enum: LedgerMouvementType, name: "mouvement_type" })
  mouvementType: LedgerMouvementType;

  @Column({ type: "decimal", precision: 16, scale: 6 })
  price: string;

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
