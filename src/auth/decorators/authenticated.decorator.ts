import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { JwtAuthGuard, RoleGuard } from "../guards";
import { Role } from "src/model";

export function Authenticated({ roles = [] }: { roles?: Role[] } = {}) {
  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(JwtAuthGuard, RoleGuard),
    ApiBearerAuth()
  );
}
