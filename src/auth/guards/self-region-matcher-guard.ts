import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role, User } from "src/model";
import { UserService } from "src/service";

@Injectable()
export class SelfRegionMatcherGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    const paramKey = this.reflector.get<string>(
      "self-region-matcher",
      context.getHandler()
    );
    if (!paramKey) {
      return true;
    }

    const paramValue = request.params[paramKey];
    const otherUser = await this.userService.findById(paramValue);

    try {
      await this.verify(user, otherUser);
      return true;
    } catch (e) {
      if (e instanceof ForbiddenException) {
        console.log("Here");
        return false;
      }
      //WE DON'T KNOW WHAT HAPENED SO PASS IT
      return true;
    }
  }

  async verify(user: User, otherUser: User) {
    const isAdmin = user.role === Role.ADMIN;
    const isOtherRegion = user.region !== otherUser.region;

    if (!isAdmin && isOtherRegion) {
      throw new ForbiddenException("User not in the same region");
    }
  }
}
