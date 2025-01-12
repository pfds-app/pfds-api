import { BadRequestException, Injectable } from "@nestjs/common";
import { Role, User } from "src/model";

@Injectable()
export class UserValidator {
  async checkRequiredFieldsByRole(user: User) {
    if (user.role !== Role.ADMIN && !user.region) {
      throw new BadRequestException(
        "When user.role != ADMIN , region field is required"
      );
    }

    if (user.role === Role.COMMITTEE_MANAGER && !user.committee) {
      throw new BadRequestException(
        "When user.role = COMMITTEE_MANAGER , committee field is required"
      );
    }

    if (user.role === Role.ASSOCIATION_MANAGER && !user.association) {
      throw new BadRequestException(
        "When user.role = ASSOCIATION_MANAGER , association field is required"
      );
    }
  }
}
