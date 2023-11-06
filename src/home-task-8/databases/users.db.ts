import { Types } from "mongoose";
import { PopulatedUser, UserCollection, UserSchema } from "../schemas/user.schema";

export class UsersModel {
  async getUserById(userId: string): Promise<PopulatedUser> {
    const user = await UserCollection.findById(new Types.ObjectId(userId))
      .select({ __v: 0 })
      .orFail();

    return user.toObject();
  }

  async getUserByEmail(email: string): Promise<PopulatedUser> {
    const user = await UserCollection.findOne({ email }).select({ __v: 0 });

    return user?.toObject();
  }

  async createUser(payload: UserSchema): Promise<PopulatedUser> {
    const newUser = new UserCollection(payload);
    await newUser.save();

    return newUser.toObject();
  }
}
