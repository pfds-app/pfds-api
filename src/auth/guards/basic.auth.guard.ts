import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { IncomingHttpHeaders } from "http";
import { BasicAuthService } from "src/service/basic.auth.service";

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private readonly basicAuthService: BasicAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request.headers);

    if (!token) {
      throw new UnauthorizedException();
    }

    request["user"] = await this.basicAuthService.getUserByToken(token);
    return true;
  }

  private extractToken(headers: IncomingHttpHeaders): string | null {
    const BEARER_TYPE = "Bearer";
    const authorizationHeader = headers.authorization || "";
    const [tokenType, token] = authorizationHeader.split(" ");

    return tokenType === BEARER_TYPE ? token : null;
  }
}
