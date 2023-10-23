import { Property, Collection, Entity, OneToMany, OneToOne, PrimaryKey } from "@mikro-orm/core";
import { Order } from "./order.entity";
import { Cart } from "./cart.entity";

@Entity()
export class User {
  @PrimaryKey({ type: "uuid", defaultRaw: "uuid_generate_v4()" })
  id!: string;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart!: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders = new Collection<Order>(this);

  @Property()
  name!: string;

  @Property()
  email!: string;
}
