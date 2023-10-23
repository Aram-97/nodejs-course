import { Entity, Property, PrimaryKey, Collection, OneToOne, OneToMany } from "@mikro-orm/core";

import { CartItem } from "./cartItem.entity";
import { User } from "./user.entity";

@Entity()
export class Cart {
  @PrimaryKey({ type: "uuid", defaultRaw: "uuid_generate_v4()" })
  id!: string;

  @OneToOne()
  user!: User;

  @OneToMany(() => CartItem, (item) => item.cart, { orphanRemoval: true })
  items = new Collection<CartItem>(this);

  @Property()
  isDeleted = false;

  constructor(dto: { user: User; isDeleted?: boolean }) {
    this.user = dto.user;
    this.isDeleted = dto.isDeleted ?? false;
  }
}
