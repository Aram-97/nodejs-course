import { NotFoundError } from "@mikro-orm/core";

import { CartData, CartPayload, OrderData, OrderPayload } from "../model";
import { CartModel } from "../databases/cart.db";
import { OrdersModel } from "../databases/orders.db";
import { ProductsModel } from "../databases/products.db";
import { Cart } from "../entities/cart.entity";
import { CartItem } from "../entities/cartItem.entity";

function calcCartTotalPrice(cart: Cart | CartData["cart"]): number {
  if (!cart?.items?.length) {
    return 0;
  }

  return cart.items.reduce((sum, item) => sum + item.product.price * item.count, 0);
}

function transformToCartData(cart: Cart): CartData["cart"] {
  return {
    id: cart.id,
    items: cart.items.map((item) => ({
      product: item.product,
      count: item.count,
      price: item.price,
    })),
  };
}

export async function createCart(userId: string): Promise<CartData> {
  const cart = await new CartModel().createCart(userId);
  return { cart: transformToCartData(cart), totalPrice: 0 };
}

export async function getCartByUser(userId: string): Promise<CartData & { isCreated: boolean }> {
  try {
    const cart = await new CartModel().getCartByUser(userId);
    const totalPrice = calcCartTotalPrice(cart);

    if (cart.isDeleted) {
      return {
        cart: { ...transformToCartData(cart), items: [] },
        isCreated: false,
        totalPrice: 0,
      };
    }

    return {
      cart: transformToCartData(cart),
      totalPrice,
      isCreated: false,
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      const data = await createCart(userId);

      return {
        ...data,
        isCreated: true,
      };
    }
  }
}

export async function updateProductInCart(
  userId: string,
  { productId, count }: CartPayload
): Promise<CartData> {
  const model = new CartModel();
  const cart = await model.getCartByUser(userId);
  let updatedItems = cart.items.slice();

  if (cart.isDeleted) {
    return { cart: transformToCartData(cart), totalPrice: 0 };
  }

  const itemIndex = updatedItems.findIndex(({ product }) => product.id === productId);
  const isItemInCart = itemIndex > -1;

  if (!isItemInCart && count > 0) {
    const product = await new ProductsModel().getProductById(productId);

    updatedItems.push(new CartItem({ cart, product, count, price: product.price }));
  } else if (isItemInCart && count > 0) {
    updatedItems[itemIndex].count = count;
  } else if (isItemInCart && count <= 0) {
    updatedItems.splice(itemIndex, 1);
  }

  const updatedCart = await model.updateCart(cart.id, { items: updatedItems });
  const totalPrice = calcCartTotalPrice(updatedCart);

  return { cart: transformToCartData(updatedCart), totalPrice };
}

export async function deleteCart(userId: string): Promise<boolean> {
  const model = new CartModel();
  const cart = await model.getCartByUser(userId);
  await model.updateCart(cart.id, { isDeleted: true });

  return true;
}

export async function checkoutCart(
  userId: string,
  { payment, delivery }: OrderPayload
): Promise<OrderData> {
  const cart = await new CartModel().getCartByUser(userId);
  const totalPrice = calcCartTotalPrice(cart);
  const order = await new OrdersModel().createOrder({ cart, payment, delivery, totalPrice });

  return {
    order: {
      id: order.id,
      cartId: cart.id,
      userId: order.user.id,
      status: order.status,
      comments: order.comments,
      totalPrice: order.totalPrice,
      items: order.items.map((item) => ({
        product: item.product,
        count: item.count,
        price: item.price,
      })),
      payment: {
        type: order.payment.type,
        address: order.payment.address,
        creditCard: order.payment.creditCard,
      },
      delivery: {
        type: order.delivery.type,
        address: order.delivery.address,
      },
    },
  };
}
