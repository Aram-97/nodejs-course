import { DI } from "../app";
import { OrderPayload } from "../model";
import { Cart } from "../entities/cart.entity";
import { Delivery } from "../entities/delivery.entity";
import { ORDER_STATUS, Order } from "../entities/order.entity";
import { OrderItem } from "../entities/orderItem.entity";
import { Payment } from "../entities/payment.entity";

export class OrdersModel {
  async createOrder(data: {
    cart: Cart;
    payment: OrderPayload["payment"];
    delivery: OrderPayload["delivery"];
    totalPrice: number;
  }) {
    const { cart, payment, delivery, totalPrice } = data;

    const order = new Order({
      totalPrice,
      user: cart.user,
      status: ORDER_STATUS.CREATED,
    });

    const orderItems = cart.items.map((item) =>
      DI.em.create(OrderItem, {
        order,
        count: item.count,
        price: item.price,
        product: item.product,
      })
    );

    order.payment = DI.em.create(Payment, { order, ...payment });
    order.delivery = DI.em.create(Delivery, { order, ...delivery });
    order.items.set(orderItems);
    cart.isDeleted = true;

    await DI.em.persistAndFlush([order, cart]);
    return order;
  }
}
