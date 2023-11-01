import { UserSchema } from "@src/home-task-8/schemas/user.schema";

export type UserRegisterPayload = Omit<UserSchema, "role"> & {
  isAdmin?: boolean;
};

export type UserLoginPayload = Pick<UserSchema, "email" | "password">;

export interface CurrentUser {
  user_id: string;
  email: string;
  role: string;
}
