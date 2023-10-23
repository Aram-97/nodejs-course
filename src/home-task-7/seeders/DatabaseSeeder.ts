import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";

import { User } from "../entities/user.entity";
import { Cart } from "../entities/cart.entity";
import { Product } from "../entities/product.entity";
import { CartItem } from "../entities/cartItem.entity";

import { UserSeeder } from "./UserSeeder";
import { ProductSeeder } from "./ProductSeeder";
import { CartSeeder } from "./CartSeeder";
import { OrderSeeder } from "./OrderSeeder";

export type SeederContext = {
  user: User;
  cart: Cart;
  products: Product[];
  cartItems: CartItem[];
};

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [UserSeeder, ProductSeeder, CartSeeder, OrderSeeder]);
  }
}
