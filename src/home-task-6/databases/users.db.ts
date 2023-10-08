import fs from "fs";
import { APP_DATA_DIR_PATH, USERS_FILE_NAME } from "../env";
import { UserEntity } from "../schemas/user.entity";

export class UsersModel {
  FILE_PATH = APP_DATA_DIR_PATH.concat(USERS_FILE_NAME);

  async getUsers(): Promise<UserEntity[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.FILE_PATH, (error, data) => {
        if (error) {
          reject(error);
          return;
        }

        try {
          const users: UserEntity[] = JSON.parse(data.toString());
          resolve(users);
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}
