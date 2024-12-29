import { RestUser } from "src/model/rest/user.rest";

export type Whoami = RestUser & { token: string };
export type JwtPayload = Pick<RestUser, "id" | "username">;
