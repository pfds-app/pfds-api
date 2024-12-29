import { Injectable } from "@nestjs/common";

import { User } from "../user.entity";
import { RestUser } from "../rest/user.rest";

@Injectable()
export class UserMapper {
  async toRest(user: User): Promise<RestUser> {
    const copiedUser = { ...user };
    delete copiedUser.password;
    return copiedUser;
  }
}
