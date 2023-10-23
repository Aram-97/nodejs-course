import { PrimaryKey, Entity, Property, ManyToOne } from "@mikro-orm/core";

import { Product } from "./product.entity";
import { Cart } from "./cart.entity";

@Entity()
export class CartItem {
  @ManyToOne({ primary: true })
  cart!: Cart;

  @ManyToOne({ primary: true })
  product!: Product;

  @Property()
  count!: number;

  @Property()
  price!: number;

  constructor(dto: { cart: Cart; product: Product; count: number; price: number }) {
    if (!dto) return;

    this.cart = dto.cart;
    this.product = dto.product;
    this.count = dto.count;
    this.price = dto.price;
  }
}
