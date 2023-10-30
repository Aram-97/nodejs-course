import { Types } from "mongoose";
import { runIfNotNil } from "../../utils";
import { CartCollection, CartItemSchema, CartSchema, PopulatedCart } from "../schemas/cart.schema";

export class CartModel {
  async createCart(userId: string): Promise<PopulatedCart> {
    const cart = await CartCollection.findOne({ user: new Types.ObjectId(userId) })
      .populate<PopulatedCart>(["user", "items", "items.product"])
      .select({ __v: 0 });

    if (cart) {
      return cart.toObject();
    } else {
      const newCart = new CartCollection({
        user: new Types.ObjectId(userId),
        isDeleted: false,
        items: [],
      });

      await newCart.save();
      return newCart.toObject();
    }
  }

  async getCartByUser(userId: string): Promise<PopulatedCart> {
    const cart = await CartCollection.findOne({ user: new Types.ObjectId(userId) })
      .populate<PopulatedCart>(["user", "items", "items.product"])
      .select({ __v: 0 })
      .orFail();

    return cart.toObject();
  }

  async updateCart(
    cartId: string,
    { items, isDeleted }: Partial<Pick<CartSchema, "isDeleted" | "items">>
  ): Promise<PopulatedCart> {
    const cart = await CartCollection.findById(new Types.ObjectId(cartId))
      .select({ user: 0, __v: 0 })
      .orFail();

    runIfNotNil(isDeleted, () => (cart.isDeleted = isDeleted));

    runIfNotNil(items, () => (cart.items = items));

    await cart.save();

    const populatedCart = await cart.populate<PopulatedCart>(["user", "items", "items.product"]);

    return populatedCart.toObject();
  }
}
