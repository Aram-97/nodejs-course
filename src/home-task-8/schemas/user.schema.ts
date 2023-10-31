import { Require_id, Schema, model } from "mongoose";

export interface UserSchema {
  name: string;
  email: string;
}

export type PopulatedUser = Require_id<UserSchema>;

const schema = new Schema<UserSchema>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

export const UserCollection = model<UserSchema>("User", schema);
