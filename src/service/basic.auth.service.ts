import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "src/model";

@Injectable()
export class BasicAuthService {
  constructor() {}

  async getUserByToken(token: string | null): Promise<User> {
    if (!token) {
      throw new UnauthorizedException();
    }
    return Promise.resolve({
      id: "dummy",
      name: "dummy",
      email: "dummy@gmail.com",
    });
  }
}
