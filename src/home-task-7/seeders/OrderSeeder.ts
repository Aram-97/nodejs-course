import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";

import { SeederContext } from "./DatabaseSeeder";
import { ORDER_STATUS, Order } from "../entities/order.entity";
import { OrderItem } from "../entities/orderItem.entity";
import { Payment } from "../entities/payment.entity";
import { Delivery } from "../entities/delivery.entity";
import { PaymentFactory } from "./factories/PaymentFactory";
import { DeliveryFactory } from "./factories/DeliveryFactory";

export class OrderSeeder extends Seeder {
  async run(em: EntityManager, context: SeederContext): Promise<void> {
    const order = em.create(Order, {
      user: context.user,
      status: ORDER_STATUS.CREATED,
      comments: "This is a mocked Order",
      totalPrice: 0,
    });

    context.cartItems.forEach((item) =>
      em.create(OrderItem, {
        order,
        product: item.product,
        price: item.price,
        count: item.count,
      })
    );

    em.create(Payment, new PaymentFactory(em, order).makeOne());
    em.create(Delivery, new DeliveryFactory(em, order).makeOne());

    order.totalPrice = order.items
      .toArray()
      .reduce((sum, item) => sum + item.price * item.count, 0);
  }
}
