import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { JwtAuthGuard, RoleGuard, SelfMatcherGuard } from "../guards";
import { Role } from "src/model";
import { SelfRegionMatcherGuard } from "../guards/self-region-matcher-guard";

export function Authenticated({
  roles = [],
  selfMatcher = "",
  selfRegionMatcher = "",
}: {
  roles?: Role[];
  selfMatcher?: string;
  selfRegionMatcher?: string;
} = {}) {
  return applyDecorators(
    SetMetadata("roles", roles),
    SetMetadata("self-region-matcher", selfRegionMatcher),
    SetMetadata("self-matcher", selfMatcher),
    UseGuards(
      JwtAuthGuard,
      RoleGuard,
      SelfMatcherGuard,
      SelfRegionMatcherGuard
    ),
    ApiBearerAuth()
  );
}
