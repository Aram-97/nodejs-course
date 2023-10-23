import { Cart } from "./entities/cart.entity";
import { CartItem } from "./entities/cartItem.entity";
import { Delivery } from "./entities/delivery.entity";
import { Order } from "./entities/order.entity";
import { OrderItem } from "./entities/orderItem.entity";
import { Payment } from "./entities/payment.entity";
import { Product } from "./entities/product.entity";

export interface ErrorResponse {
  message: string;
}

export interface ApiResponse<T = null> {
  data: T | null;
  error: ErrorResponse | null;
}

export interface CartData {
  cart: Pick<Cart, "id"> & { items: Omit<CartItem, "id" | "cart">[] };
  totalPrice: number;
}
export interface CartPayload {
  productId: string;
  count: number;
}
export type CartResponse = ApiResponse<CartData>;

export interface OrderData {
  order: Omit<Order, "user" | "payment" | "delivery" | "items"> & {
    userId: string;
    cartId: string;
    payment: Omit<Payment, "id" | "order">;
    delivery: Omit<Delivery, "id" | "order">;
    items: Omit<OrderItem, "id" | "order">[];
  };
}
export interface OrderPayload {
  payment: Pick<Payment, "type" | "address" | "creditCard">;
  delivery: Pick<Delivery, "type" | "address">;
}
export type OrderResponse = ApiResponse<OrderData>;

export type ProductsResponse = ApiResponse<Product[]>;
export type ProductResponse = ApiResponse<Product>;

export type EmptySuccessResponse = ApiResponse<{
  success: boolean;
}>;
