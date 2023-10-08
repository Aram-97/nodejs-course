import fs from "fs";
import crypto from "crypto";
import { CartEntity } from "../schemas/cart.entity";
import { APP_DATA_DIR_PATH, CART_FILE_NAME } from "../env";

export class CartModel {
  getFilePathByUser(userId: string) {
    return APP_DATA_DIR_PATH.concat(`${userId}/`).concat(CART_FILE_NAME);
  }

  async createCart(userId: string): Promise<CartEntity> {
    return new Promise((resolve, reject) => {
      fs.mkdir(APP_DATA_DIR_PATH.concat(`${userId}/`), { recursive: true }, (error) => {
        if (error) {
          reject(error);
          return;
        }

        const filePath = this.getFilePathByUser(userId);
        const newCart: CartEntity = {
          id: crypto.randomUUID(),
          userId,
          isDeleted: false,
          items: [],
        };

        fs.writeFile(filePath, JSON.stringify(newCart), (err) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(newCart);
        });
      });
    });
  }

  async getCart(userId: string): Promise<CartEntity> {
    return new Promise((resolve, reject) => {
      const filePath = this.getFilePathByUser(userId);

      fs.readFile(filePath, (error, data) => {
        if (error) {
          reject(error);
          return;
        }

        try {
          const cart: CartEntity = JSON.parse(data.toString());
          resolve(cart);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  async updateCart(userId: string, cart: CartEntity): Promise<CartEntity> {
    return new Promise((resolve, reject) => {
      const filePath = this.getFilePathByUser(userId);

      fs.writeFile(filePath, JSON.stringify(cart), (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(cart);
      });
    });
  }
}
