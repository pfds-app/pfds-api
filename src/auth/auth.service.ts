import { Injectable } from "@nestjs/common";
import { User } from "src/model";
import { UserService } from "src/service/user.service";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async whoami(firebaseUser: User) {
    const user = await this.userService.findById(firebaseUser.id);
    if (user) return user;

    return this.userService.saveUser({
      id: firebaseUser.id,
      email: firebaseUser.email,
      name: firebaseUser.name,
    });
  }
}
