import { Injectable } from "@nestjs/common";
import { User } from "src/model";

@Injectable()
export class AuthService {
  async whoami(candidateUser: User) {
    return candidateUser;
  }
}
