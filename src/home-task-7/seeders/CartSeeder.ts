import type { EntityManager } from "@mikro-orm/core";
import { Seeder, faker } from "@mikro-orm/seeder";

import { SeederContext } from "./DatabaseSeeder";
import { Cart } from "../entities/cart.entity";
import { CartItem } from "../entities/cartItem.entity";

export class CartSeeder extends Seeder {
  async run(em: EntityManager, context: SeederContext): Promise<void> {
    const products = context.products.slice(0, 3);

    context.cart = em.create(Cart, {
      user: context.user,
      isDeleted: false,
    });

    context.cartItems = products.map((product) =>
      em.create(CartItem, {
        product,
        cart: context.cart,
        price: product.price,
        count: faker.datatype.number({ min: 1, max: 5 }),
      })
    );
  }
}
