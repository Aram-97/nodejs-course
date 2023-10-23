import { PrimaryKey, Entity, Property, ManyToOne } from "@mikro-orm/core";

import { Product } from "./product.entity";
import { Order } from "./order.entity";

@Entity()
export class OrderItem {
  @ManyToOne({ primary: true })
  order!: Order;

  @ManyToOne({ primary: true })
  product!: Product;

  @Property()
  count!: number;

  @Property()
  price!: number;

  constructor(dto: { order: Order; product: Product; count: number; price: number }) {
    if (!dto) return;

    this.order = dto.order;
    this.product = dto.product;
    this.count = dto.count;
    this.price = dto.price;
  }
}
