import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { Authenticated, AuthenticatedUser } from "./decorators";
import { ApiPfds } from "src/docs/decorators";
import { User } from "src/model";

@Controller()
@ApiTags("Security")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("/whoami")
  @Authenticated()
  @ApiPfds({
    operationId: "whoami",
    type: User,
    operationOptions: {
      description: "Tell who you are",
    },
  })
  whoami(@AuthenticatedUser() user: User) {
    return this.authService.whoami(user);
  }
}
