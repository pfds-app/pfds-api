import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
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

  async verifyUpdatePrivilege(
    authenticatedUser: User,
    beforeUpdate: User,
    updatedUser: User
  ) {
    switch (authenticatedUser.role) {
      case Role.ADMIN:
        return this.updateByAdminVerificator(
          authenticatedUser,
          beforeUpdate,
          updatedUser
        );
      case Role.REGION_MANAGER:
        return this.updateByRegionManagerVerificator(
          authenticatedUser,
          beforeUpdate,
          updatedUser
        );
      case Role.COMMITTEE_MANAGER:
        return this.updateByCommitteeManagerVerificator(
          authenticatedUser,
          beforeUpdate,
          updatedUser
        );
      case Role.ASSOCIATION_MANAGER:
        return this.updateByAssociationManagerVerificator(
          authenticatedUser,
          beforeUpdate,
          updatedUser
        );
      case Role.SIMPLE_USER:
        return this.updateBySimpleUserVerificator(
          authenticatedUser,
          beforeUpdate,
          updatedUser
        );
      default:
        throw new BadRequestException("Not valid role");
    }
  }

  private async updateByAdminVerificator(
    _authenticatedUser: User,
    _beforeUpdate: User,
    _updatedUser: User
  ) {
    return;
  }

  private async updateByRegionManagerVerificator(
    authenticatedUser: User,
    beforeUpdate: User,
    updatedUser: User
  ) {
    if (
      beforeUpdate.role === Role.ADMIN ||
      updatedUser.role === Role.ADMIN ||
      beforeUpdate.region?.id !== authenticatedUser.region?.id
    ) {
      throw new ForbiddenException("Required valide permission");
    }
  }

  private async updateByCommitteeManagerVerificator(
    authenticatedUser: User,
    beforeUpdate: User,
    updatedUser: User
  ) {
    if (
      beforeUpdate.role !== updatedUser.role ||
      beforeUpdate?.association?.id !== updatedUser?.association?.id ||
      beforeUpdate?.region?.id !== authenticatedUser?.region?.id
    ) {
      throw new ForbiddenException("Required valide permission");
    }
  }

  private async updateByAssociationManagerVerificator(
    authenticatedUser: User,
    beforeUpdate: User,
    updatedUser: User
  ) {
    if (
      beforeUpdate?.role !== updatedUser?.role ||
      beforeUpdate?.committee?.id !== updatedUser?.committee?.id ||
      beforeUpdate?.region?.id !== authenticatedUser?.region?.id
    ) {
      throw new ForbiddenException("Required valide permission");
    }
  }

  private async updateBySimpleUserVerificator(
    authenticatedUser: User,
    beforeUpdate: User,
    updatedUser: User
  ) {
    if (
      authenticatedUser?.id !== updatedUser?.id ||
      beforeUpdate?.role !== updatedUser?.role ||
      beforeUpdate?.committee?.id !== updatedUser?.committee?.id ||
      beforeUpdate?.association?.id !== updatedUser?.association?.id ||
      beforeUpdate?.region?.id !== updatedUser?.region?.id
    ) {
      throw new ForbiddenException("Required valide permission");
    }
  }
}
