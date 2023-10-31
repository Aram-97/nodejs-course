import { Require_id } from "mongoose";

import { PopulatedCart, PopulatedCartItem } from "./schemas/cart.schema";
import { PopulatedProduct, ProductSchema } from "./schemas/product.schema";
import {
  DeliverySchema,
  PaymentSchema,
  PopulatedOrder,
  PopulatedOrderItem,
} from "./schemas/order.schema";

export type WithId<T> = T extends Require_id<T>
  ? Omit<T, "_id"> & { id: string }
  : T & { id: string };

export interface ErrorResponse {
  message: string;
}

export interface ApiResponse<T = null> {
  data: T | null;
  error: ErrorResponse | null;
}

export interface CartData {
  totalPrice: number;
  cart: Pick<WithId<PopulatedCart>, "id"> & {
    items: Array<Omit<PopulatedCartItem, "product"> & { product: WithId<PopulatedProduct> }>;
  };
}
export interface CartPayload {
  productId: string;
  count: number;
}
export type CartResponse = ApiResponse<CartData>;

export interface OrderData {
  order: Omit<WithId<PopulatedOrder>, "user" | "cart" | "items"> & {
    userId: string;
    cartId: string;
    items: Array<Omit<PopulatedOrderItem, "product"> & { product: WithId<PopulatedProduct> }>;
  };
}
export interface OrderPayload {
  payment: PaymentSchema;
  delivery: DeliverySchema;
}
export type OrderResponse = ApiResponse<OrderData>;

export type ProductData = WithId<PopulatedProduct>;
export type ProductsResponse = ApiResponse<ProductData[]>;
export type ProductResponse = ApiResponse<ProductData>;

export type EmptySuccessResponse = ApiResponse<{
  success: boolean;
}>;
