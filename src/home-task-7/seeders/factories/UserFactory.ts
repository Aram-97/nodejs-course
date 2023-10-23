import { Factory, Faker } from "@mikro-orm/seeder";

import { User } from "../../entities/user.entity";

export class UserFactory extends Factory<User> {
  model = User;

  definition(faker: Faker): Partial<User> {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return {
      name: `${firstName} ${lastName}`,
      email: faker.internet.email(firstName, lastName),
    };
  }
}
