import { OrderPayload } from "../model";
import { PopulatedCart } from "../schemas/cart.schema";
import { ORDER_STATUS, OrderCollection, PopulatedOrder } from "../schemas/order.schema";

export class OrdersModel {
  async createOrder(data: {
    cart: PopulatedCart;
    payment: OrderPayload["payment"];
    delivery: OrderPayload["delivery"];
    totalPrice: number;
  }): Promise<PopulatedOrder> {
    const { cart, payment, delivery, totalPrice } = data;

    const order = new OrderCollection({
      payment,
      delivery,
      totalPrice,
      cart: cart._id,
      user: cart.user._id,
      items: cart.items,
      status: ORDER_STATUS.CREATED,
    });

    await order.save();

    const populatedOrder = await order.populate<PopulatedOrder>([
      "user",
      "cart",
      "items",
      "items.product",
      "payment",
      "delivery",
    ]);

    return populatedOrder.toObject();
  }
}
