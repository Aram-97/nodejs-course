import { CartData, OrderData } from "../model";
import { CartModel } from "../databases/cart.db";
import { OrdersModel } from "../databases/orders.db";
import { CartEntity, CartItemEntity } from "../schemas/cart.entity";

function calcCartTotalPrice(cart: CartEntity): number {
  if (!cart?.items?.length) {
    return 0;
  }

  return cart.items.reduce((sum, item) => sum + item.product.price * item.count, 0);
}

export async function createCart(userId: string): Promise<CartData> {
  const cart = await new CartModel().createCart(userId);
  return { cart, totalPrice: 0 };
}

export async function getCart(userId: string): Promise<CartData & { isCreated: boolean }> {
  try {
    const cart = await new CartModel().getCart(userId);
    const totalPrice = calcCartTotalPrice(cart);

    if (cart.isDeleted) {
      return {
        cart: { ...cart, items: [] },
        isCreated: false,
        totalPrice: 0,
      };
    }

    return {
      cart,
      totalPrice,
      isCreated: false,
    };
  } catch (error) {
    const data = await createCart(userId);

    return {
      ...data,
      isCreated: true,
    };
  }
}

export async function updateCart(userId: string, items: CartItemEntity[]): Promise<CartData> {
  const model = new CartModel();
  const cart = await model.getCart(userId);
  let updatedItems = cart.items.slice();

  if (cart.isDeleted) {
    return { cart, totalPrice: 0 };
  }

  items.forEach((item) => {
    const itemIndex = updatedItems.findIndex(({ product }) => product.id === item.product.id);
    const isItemInCart = itemIndex > -1;

    if (!isItemInCart && item.count > 0) {
      updatedItems.push(item);
      return;
    }

    if (isItemInCart && item.count > 0) {
      updatedItems.splice(itemIndex, 1, item);
      return;
    }

    if (isItemInCart && item.count <= 0) {
      updatedItems.splice(itemIndex, 1);
      return;
    }
  });

  const updatedCart = await model.updateCart(userId, { ...cart, items: updatedItems });
  const totalPrice = calcCartTotalPrice(updatedCart);

  return { cart: updatedCart, totalPrice };
}

export async function deleteCart(userId: string): Promise<boolean> {
  const model = new CartModel();
  const cart = await model.getCart(userId);
  await model.updateCart(userId, { ...cart, isDeleted: true });

  return true;
}

export async function checkoutCart(userId: string): Promise<OrderData> {
  const cart = await new CartModel().getCart(userId);
  const totalPrice = calcCartTotalPrice(cart);
  const order = await new OrdersModel().createOrder({ cart, totalPrice });

  return { order };
}
