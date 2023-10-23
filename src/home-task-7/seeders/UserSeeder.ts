import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";

import { SeederContext } from "./DatabaseSeeder";
import { UserFactory } from "./factories/UserFactory";

export class UserSeeder extends Seeder {
  async run(em: EntityManager, context: SeederContext): Promise<void> {
    const users = await new UserFactory(em).create(5);
    context.user = users[0];
  }
}
