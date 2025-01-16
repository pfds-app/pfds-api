import * as bcrypt from "bcrypt";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { User } from "src/model";
import { UserService } from "src/service";
import { UserMapper } from "src/controller/mapper";
import {
  Whoami,
  JwtPayload,
  SigninPayload,
  SignupPayload,
  SigninByRole,
} from "./model";

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

  async signup({
    adminApiKey,
    ...signupPayload
  }: SignupPayload): Promise<Whoami> {
    if (
      !(await this.allowAdminSignup()) ||
      adminApiKey !== process.env.ADMIN_API_KEY
    ) {
      throw new ForbiddenException("Invalid credentials");
    }

    const user = await this.userMapper.createToDomain(signupPayload);
    const savedUser = await this.userService.createUser(user);
    return this.domainUserToWhoami(savedUser);
  }

  async signin({
    username: candidateUsername,
    password: candidatePassword,
  }: SigninPayload): Promise<Whoami> {
    const user = await this.userService.findByUsername(candidateUsername);
    if (!user) {
      throw new ForbiddenException("Invalid credentials");
    }

    const isCorrectPassword = await bcrypt.compare(
      candidatePassword,
      user.password
    );
    if (!isCorrectPassword) {
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

  async allowAdminSignup() {
    const users = await this.userService.findAll({ page: 1, pageSize: 1 }, {});
    return !(users.length > 0);
  }

  async signinByRole(payload: SigninByRole) {
    if (!payload.lastName || !payload.firstName || !payload.responsabilityId) {
      throw new ForbiddenException("Invalid Credentials");
    }

    const users = await this.userService.findAll(
      { page: 1, pageSize: 1 },
      {
        firstName: payload.firstName,
        lastName: payload.lastName,
        region: {
          id: payload.regionId,
        },
        association: {
          id: payload.associationId,
        },
        committee: {
          id: payload.committeeId,
        },
        responsability: {
          id: payload.responsabilityId,
        },
      }
    );

    if (users.length > 1) {
      throw new BadRequestException("Many users have the same credentials");
    }

    const [user] = users;
    return this.domainUserToWhoami(user);
  }
}
