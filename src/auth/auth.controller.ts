import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import {
  Authenticated,
  AuthenticatedUser,
  AuthenticatedUserToken,
} from "./decorators";
import { ApiJfds } from "src/docs/decorators";
import { User } from "src/model";
import { Whoami, SigninPayload, SignupPayload, SigninByRole } from "./model";

@Controller()
@ApiTags("Security")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("/whoami")
  @Authenticated()
  @ApiJfds({
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

  @Post("/signin-by-role")
  @ApiBody({ type: SigninByRole })
  @ApiJfds({
    type: Whoami,
    operationId: "signinByRole",
  })
  async signinByRole(@Body() signinByRole: SigninByRole) {
    return this.authService.signinByRole(signinByRole);
  }

  @Post("/signin")
  @ApiBody({ type: SigninPayload })
  @ApiJfds({
    type: Whoami,
    operationId: "signin",
  })
  async signin(@Body() signinPayload: SigninPayload) {
    return this.authService.signin(signinPayload);
  }

  @Post("/signup")
  @ApiBody({ type: SignupPayload })
  @ApiJfds({
    type: Whoami,
    operationId: "signup",
  })
  async signup(@Body() signupPayload: SignupPayload) {
    return this.authService.signup(signupPayload);
  }

  @Get("/admin-signup/allows")
  @ApiJfds({
    type: Boolean,
    operationId: "allowAdminSignup",
  })
  async allowAdminSignup() {
    return this.authService.allowAdminSignup();
  }
}
