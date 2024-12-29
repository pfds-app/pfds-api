import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import {
  Authenticated,
  AuthenticatedUser,
  AuthenticatedUserToken,
} from "./decorators";
import { ApiPfds } from "src/docs/decorators";
import { User } from "src/model";
import { Whoami } from "./types";
import { SigninPayload, SignupPayload } from "./model";

@Controller()
@ApiTags("Security")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("/whoami")
  @Authenticated()
  @ApiPfds({
    type: Whoami,
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

  @Post("/signin")
  @ApiBody({ type: SigninPayload })
  @ApiPfds({
    type: Whoami,
    operationId: "signin",
  })
  async signin(@Body() signinPayload: SigninPayload) {
    return this.authService.signin(signinPayload);
  }

  @Post("/signup")
  @ApiBody({ type: SigninPayload })
  @ApiPfds({
    type: Whoami,
    operationId: "signin",
  })
  async signup(@Body() signupPayload: SignupPayload) {
    return this.authService.signup(signupPayload);
  }
}
