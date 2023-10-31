import { DI } from "../app";
import { runIfNotNil } from "../../utils";
import { Cart } from "../entities/cart.entity";
import { CartItem } from "../entities/cartItem.entity";
import { UsersModel } from "./users.db";

export class CartModel {
  async createCart(userId: string) {
    const cart = await DI.cartRepo.findOne({ user: { id: userId } }, { populate: true });

    if (cart) {
      return cart;
    } else {
      const user = await new UsersModel().getUserById(userId);
      const newCart = DI.em.create(Cart, { user: user });

      await DI.em.persistAndFlush(newCart);
      return newCart;
    }
  }

  async getCartByUser(userId: string) {
    const cart = await DI.cartRepo.findOneOrFail({ user: { id: userId } }, { populate: true });

    return cart;
  }

  async updateCart(
    cartId: string,
    { items, isDeleted }: Partial<Pick<Cart, "isDeleted"> & { items: CartItem[] }>
  ) {
    const cart = await DI.cartRepo.findOneOrFail(cartId, { populate: true });
    const cartItems = items.map((item) => DI.em.create(CartItem, item));

    runIfNotNil(isDeleted, () => (cart.isDeleted = isDeleted));
    runIfNotNil(items, () => cart.items.set(cartItems));

    await DI.em.persistAndFlush(cart);
    return cart;
  }
}
