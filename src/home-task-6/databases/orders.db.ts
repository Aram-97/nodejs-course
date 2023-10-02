import fs from "fs";
import crypto from "crypto";
import { CartData } from "../model";
import { OrderEntity } from "../schemas/order.entity";
import { APP_DATA_DIR_PATH, ORDERS_DIR_PATH } from "../env";

export class OrdersModel {
  getOrderFileByUser(userId: string, orderId: string) {
    return APP_DATA_DIR_PATH.concat(userId).concat(ORDERS_DIR_PATH).concat(orderId).concat(".json");
  }

  async createOrder(data: CartData): Promise<OrderEntity> {
    return new Promise((resolve, reject) => {
      const { cart, totalPrice } = data;

      fs.mkdir(
        APP_DATA_DIR_PATH.concat(cart.userId).concat(ORDERS_DIR_PATH),
        { recursive: true },
        (error) => {
          if (error) {
            reject(error);
            return;
          }

          const newOrder: OrderEntity = {
            id: crypto.randomUUID(),
            userId: cart.userId,
            cartId: cart.id,
            items: cart.items,
            payment: {
              type: "paypal",
              address: "London",
              creditCard: "1234-1234-1234-1234",
            },
            delivery: {
              type: "post",
              address: "London",
            },
            status: "created",
            comments: "",
            totalPrice,
          };

          const filePath = this.getOrderFileByUser(cart.userId, newOrder.id);

          fs.writeFile(filePath, JSON.stringify(newOrder), (err) => {
            if (err) {
              reject(err);
              return;
            }

            resolve(newOrder);
          });
        }
      );
    });
  }
}
