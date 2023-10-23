import { DI } from "../app";

export class UsersModel {
  async getUserById(userId: string) {
    const user = await DI.userRepo.findOneOrFail(userId);

    return user;
  }
}
