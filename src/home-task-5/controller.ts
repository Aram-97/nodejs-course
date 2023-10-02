import { USERS_DATA, User } from "./data";

type UserDataPayload = Omit<User, "id">;

class UserController {
  findUserIndex(id: string, reject: (reason?: any) => void): number {
    const userIndex = USERS_DATA.findIndex((user) => String(user.id) === id);

    if (userIndex === -1) {
      reject(`Not found user with id [${id}]!`);
    }

    return userIndex;
  }

  async getUsers() {
    return Promise.resolve(USERS_DATA ?? []);
  }

  async getUserById(id: string) {
    return new Promise<Omit<User, "hobbies">>((resolve, reject) => {
      const userIndex = this.findUserIndex(id, reject);

      if (userIndex === -1) return;

      const user = USERS_DATA[userIndex];

      resolve({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    });
  }

  async createUser(payload: UserDataPayload) {
    return new Promise((resolve, reject) => {
      if (!payload?.name) {
        reject("User name is required!");
        return;
      }

      if (!payload?.email) {
        reject("User email is required!");
        return;
      }

      const latestId = USERS_DATA.at(-1)?.id ?? 0;
      const newUser: User = {
        id: latestId + 1,
        name: payload.name,
        email: payload.email,
        hobbies: payload.hobbies ?? [],
      };

      USERS_DATA.push(newUser);
      resolve(newUser);
    });
  }

  async updateUser(id: string, payload: Partial<UserDataPayload>) {
    return new Promise((resolve, reject) => {
      const userIndex = this.findUserIndex(id, reject);

      if (userIndex === -1) return;

      const user = USERS_DATA[userIndex];
      const updatedUser: User = { ...user, ...payload, id: parseInt(id) };

      USERS_DATA.splice(userIndex, 1, updatedUser);
      resolve(updatedUser);
    });
  }

  async deleteUser(id: string) {
    return new Promise((resolve, reject) => {
      const userIndex = this.findUserIndex(id, reject);

      if (userIndex === -1) return;

      USERS_DATA.splice(userIndex, 1);
      resolve("User deleted successfully!");
    });
  }

  async getUserHobbies(id: string) {
    return new Promise((resolve, reject) => {
      const userIndex = this.findUserIndex(id, reject);

      if (userIndex === -1) return;

      const user = USERS_DATA[userIndex];

      resolve(user.hobbies);
    });
  }

  async addUserHobby(id: string, hobby: string) {
    return new Promise((resolve, reject) => {
      const userIndex = this.findUserIndex(id, reject);

      if (userIndex === -1) return;

      if (!USERS_DATA[userIndex]?.hobbies?.length) {
        USERS_DATA[userIndex].hobbies = [hobby.toLowerCase()];
      } else {
        USERS_DATA[userIndex].hobbies!.push(hobby.toLowerCase());
      }

      resolve(USERS_DATA[userIndex].hobbies);
    });
  }

  async removeUserHobby(id: string, hobby: string) {
    return new Promise((resolve, reject) => {
      const userIndex = this.findUserIndex(id, reject);

      if (userIndex === -1) return;

      const hobbyIndex = USERS_DATA[userIndex].hobbies.findIndex(
        (item) => item === hobby.toLowerCase()
      );

      if (hobbyIndex === -1) {
        reject(`Not found [${hobby.toLowerCase()}] hobby from user with id [${id}]!`);
        return;
      }

      USERS_DATA[userIndex].hobbies!.splice(hobbyIndex, 1);
      resolve(USERS_DATA[userIndex].hobbies);
    });
  }
}

export default UserController;
