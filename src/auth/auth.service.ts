import * as bcrypt from "bcrypt";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { User } from "src/model";
import { UserService } from "src/service";
import { UserMapper } from "src/model/mapper";
import { Whoami, JwtPayload, SigninPayload, SignupPayload } from "./model";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
    private readonly jwtService: JwtService
  ) {}

  async whoami(token: string, user: User): Promise<Whoami> {
    const restUser = await this.userMapper.toRest(user);
    return { ...restUser, token };
  }

  async signup(signupPayload: SignupPayload): Promise<Whoami> {
    const savedUser = await this.userService.createUser(signupPayload);
    return this.domainUserToWhoami(savedUser);
  }

  async signin({
    username: candidateUsername,
    password: candidatePassword,
  }: SigninPayload): Promise<Whoami> {
    const user = await this.userService.findByUsername(candidateUsername);

    if (!user || (await bcrypt.compare(candidatePassword, user.password))) {
      throw new ForbiddenException("Invalid credentials");
    }

    return this.domainUserToWhoami(user);
  }

  async domainUserToWhoami(user: User): Promise<Whoami> {
    const jwtPayload: JwtPayload = {
      id: user.id,
      username: user.username,
    };
    const token = this.jwtService.sign(jwtPayload);
    return this.whoami(token, user);
  }
}
