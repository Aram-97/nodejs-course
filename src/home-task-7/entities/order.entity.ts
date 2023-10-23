import {
  Enum,
  Entity,
  Property,
  Collection,
  PrimaryKey,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "@mikro-orm/core";
import { OrderItem } from "./orderItem.entity";
import { Delivery } from "./delivery.entity";
import { Payment } from "./payment.entity";
import { User } from "./user.entity";

export enum ORDER_STATUS {
  CREATED = "created",
  COMPLETED = "completed",
}

@Entity()
export class Order {
  @PrimaryKey({ type: "uuid", defaultRaw: "uuid_generate_v4()" })
  id!: string;

  @ManyToOne()
  user!: User;

  @OneToMany(() => OrderItem, (item) => item.order, { orphanRemoval: true })
  items = new Collection<OrderItem>(this);

  @OneToOne(() => Payment, (payment) => payment.order)
  payment?: Payment;

  @OneToOne(() => Delivery, (delivery) => delivery.order)
  delivery?: Delivery;

  @Enum(() => ORDER_STATUS)
  status!: ORDER_STATUS;

  @Property()
  totalPrice!: number;

  @Property()
  comments?: string;

  constructor(dto: { user: User; status: ORDER_STATUS; totalPrice: number; comments?: string }) {
    if (!dto) return;

    this.user = dto.user;
    this.status = dto.status ?? ORDER_STATUS.CREATED;
    this.totalPrice = dto.totalPrice ?? 0;
    this.comments = dto.comments;
  }
}
