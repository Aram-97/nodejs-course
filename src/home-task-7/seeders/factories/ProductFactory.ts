import { Factory, Faker } from "@mikro-orm/seeder";

import { Product } from "../../entities/product.entity";

export class ProductFactory extends Factory<Product> {
  model = Product;

  definition(faker: Faker): Partial<Product> {
    return {
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      price: Number(faker.commerce.price(10, 200, 0)),
    };
  }
}
