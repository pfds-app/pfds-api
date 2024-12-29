import { UserGender } from "../user.entity";

export class RestUser {
  id: string;
  email: string;
  username: string;
  lastName: string;
  nic?: string;
  photo?: string;
  birthDate: string;
  address: string;
  gender: UserGender;
  apv?: string;
  createdAt: string;
  updatedAt: string;
}
