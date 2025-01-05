import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsString,
  IsUUID,
} from "class-validator";
import { LedgerMouvementType } from "src/model";

export class Ledger {
  @IsUUID()
  @ApiProperty({ format: "uuid" })
  id: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsDateString()
  @ApiProperty({ format: "date" })
  ledgerDate: string;

  @IsEnum(LedgerMouvementType)
  @ApiProperty({ enum: LedgerMouvementType })
  mouvementType: LedgerMouvementType;

  @IsNumberString()
  @ApiProperty()
  price: string;

  @IsDateString()
  @ApiProperty({ format: "date-time" })
  createdAt: string;

  @IsDateString()
  @ApiProperty({ format: "date-time" })
  updatedAt: string;
}
