import { Types } from "mongoose";
import { PopulatedUser, UserCollection } from "../schemas/user.schema";

export class UsersModel {
  async getUserById(userId: string): Promise<PopulatedUser> {
    const user = await UserCollection.findById(new Types.ObjectId(userId))
      .select({ __v: 0 })
      .orFail();

    return user.toObject();
  }
}
