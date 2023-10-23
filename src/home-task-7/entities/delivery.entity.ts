import { Property, Entity, OneToOne, PrimaryKey } from "@mikro-orm/core";

import { Order } from "./order.entity";

@Entity()
export class Delivery {
  @PrimaryKey({ type: "uuid", defaultRaw: "uuid_generate_v4()" })
  id!: string;

  @OneToOne()
  order!: Order;

  @Property()
  type!: string;

  @Property()
  address!: string;

  constructor(dto: { order: Order; type: string; address: string }) {
    if (!dto) return;

    this.order = this.order;
    this.type = dto.type;
    this.address = dto.address;
  }
}
