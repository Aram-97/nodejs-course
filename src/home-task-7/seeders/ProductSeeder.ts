import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";

import { SeederContext } from './DatabaseSeeder';
import { ProductFactory } from "./factories/ProductFactory";

export class ProductSeeder extends Seeder {
  async run(em: EntityManager, context: SeederContext): Promise<void> {
    context.products = await new ProductFactory(em).create(10);
  }
}
