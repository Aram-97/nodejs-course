import { Error } from "mongoose";

import { CartData, CartPayload, OrderData, OrderPayload } from "../model";
import { CartModel } from "../databases/cart.db";
import { OrdersModel } from "../databases/orders.db";
import { PopulatedCart } from "../schemas/cart.schema";
import { ProductsModel } from "../databases/products.db";

function calcCartTotalPrice(cart: PopulatedCart): number {
  if (!cart?.items?.length) {
    return 0;
  }

  return cart.items.reduce((sum, item) => sum + item.price * item.count, 0);
}

function transformToCartData(cart: PopulatedCart): CartData["cart"] {
  return {
    id: cart._id.toString(),
    items: cart.items.map((item) => ({
      product: {
        id: item.product._id.toString(),
        title: item.product.title,
        description: item.product.description,
        price: item.product.price,
      },
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
    if (error instanceof Error.DocumentNotFoundError) {
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

  let updatedItems = cart.items.map((item) => ({
    product: item.product._id,
    count: item.count,
    price: item.price,
  }));

  if (cart.isDeleted) {
    return { cart: transformToCartData(cart), totalPrice: 0 };
  }

  const itemIndex = updatedItems.findIndex(({ product }) => product.toString() === productId);
  const isItemInCart = itemIndex > -1;

  if (!isItemInCart && count > 0) {
    const product = await new ProductsModel().getProductById(productId);

    updatedItems.push({ product: product._id, price: product.price, count });
  } else if (isItemInCart && count > 0) {
    updatedItems[itemIndex].count = count;
  } else if (isItemInCart && count <= 0) {
    updatedItems.splice(itemIndex, 1);
  }

  const updatedCart = await model.updateCart(cart._id.toString(), { items: updatedItems });
  const totalPrice = calcCartTotalPrice(updatedCart);

  return { cart: transformToCartData(updatedCart), totalPrice };
}

export async function deleteCart(userId: string): Promise<boolean> {
  const model = new CartModel();
  const cart = await model.getCartByUser(userId);
  await model.updateCart(cart._id.toString(), { isDeleted: true });

  return true;
}

export async function checkoutCart(
  userId: string,
  { payment, delivery }: OrderPayload
): Promise<OrderData> {
  const cart = await new CartModel().getCartByUser(userId);
  const totalPrice = calcCartTotalPrice(cart);
  const order = await new OrdersModel().createOrder({ cart, payment, delivery, totalPrice });

  deleteCart(userId);

  return {
    order: {
      id: order._id.toString(),
      cartId: cart._id.toString(),
      userId: order.user._id.toString(),
      status: order.status,
      comments: order.comments,
      totalPrice: order.totalPrice,
      items: order.items.map((item) => ({
        product: {
          id: item.product._id.toString(),
          title: item.product.title,
          description: item.product.description,
          price: item.product.price,
        },
        count: item.count,
        price: item.price,
      })),
      payment: {
        type: order.payment.type,
        address: order.payment.address,
        credit_card: order.payment.credit_card,
      },
      delivery: {
        type: order.delivery.type,
        address: order.delivery.address,
      },
    },
  };
}
