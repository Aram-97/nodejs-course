import { Property, Entity, PrimaryKey, OneToOne } from "@mikro-orm/core";

import { Order } from "./order.entity";

@Entity()
export class Payment {
  @PrimaryKey({ type: "uuid", defaultRaw: "uuid_generate_v4()" })
  id!: string;

  @OneToOne()
  order!: Order;

  @Property()
  type!: string;

  @Property()
  address!: string;

  @Property()
  creditCard!: string;

  constructor(dto: { order: Order; type: string; address: string; creditCard: string }) {
    if (!dto) return;

    this.order = dto.order;
    this.type = dto.type;
    this.address = dto.address;
    this.creditCard = dto.creditCard;
  }
}
