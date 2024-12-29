import { UserGender } from "../user.entity";

export type RestUser = {
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
};
