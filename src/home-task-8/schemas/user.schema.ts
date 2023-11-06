import { Require_id, Schema, model } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  BASIC = "basic",
}

export interface UserSchema {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export type PopulatedUser = Require_id<UserSchema>;

const schema = new Schema<UserSchema>({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
});

export const UserCollection = model<UserSchema>("User", schema);
