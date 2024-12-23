import { UseGuards, applyDecorators } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { BasicAuthGuard } from "src/auth/guards";

export function Authenticated() {
  return applyDecorators(UseGuards(BasicAuthGuard), ApiBearerAuth());
}
