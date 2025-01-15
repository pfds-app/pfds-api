import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role, User } from "src/model";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authorizedRoles: Role[] =
      this.reflector.get<Role[]>("roles", context.getHandler()) ?? [];

    if (authorizedRoles.length === 0) {
      return true;
    }

    const user: User | undefined = context.switchToHttp().getRequest()?.user;
    if (!user) {
      return false;
    }

    return authorizedRoles.includes(user?.role);
  }
}
