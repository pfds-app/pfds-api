import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User, UserGender } from "src/model";

@Injectable()
export class BasicAuthService {
  constructor() { }

  async getUserByToken(token: string | null): Promise<User> {
    if (!token) {
      throw new UnauthorizedException();
    }

    return Promise.resolve({
      id: "dummy",
      email: "dummy@gmail.com",
      gender: UserGender.MALE,
      address: "",
      lastName: "myLastName",
      birthDate: "2024-07-12 09:04:68",
      createdAt: "2024-07-12 09:04:68",
      updatedAt: "2024-07-12 09:04:68",
      firstName: "myLastName",
    });
  }
}
