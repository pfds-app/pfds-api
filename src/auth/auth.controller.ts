import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import {
  Authenticated,
  AuthenticatedUser,
  AuthenticatedUserToken,
} from "./decorators";
import { ApiPfds } from "src/docs/decorators";
import { User } from "src/model";

@Controller()
@ApiTags("Security")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("/whoami")
  @Authenticated()
  @ApiPfds({
    type: User,
    operationId: "whoami",
    operationOptions: {
      description: "Tell who you are",
    },
  })
  async whoami(
    @AuthenticatedUser() user: User,
    @AuthenticatedUserToken() token: string
  ) {
    return this.authService.whoami(token, user);
  }
}
