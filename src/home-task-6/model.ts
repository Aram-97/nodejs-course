import { CartEntity, CartItemEntity } from "./schemas/cart.entity";
import { OrderEntity } from "./schemas/order.entity";
import { ProductEntity } from "./schemas/product.entity";

export interface ErrorResponse {
  message: string;
}

export interface ApiResponse<T = null> {
  data: T | null;
  error: ErrorResponse | null;
}

export interface CartData {
  cart: CartEntity;
  totalPrice: number;
}
export interface CartPayload {
  id: string;
  items: CartItemEntity[];
}
export type CartResponse = ApiResponse<CartData>;

export interface OrderData {
  order: OrderEntity;
}
export type OrderResponse = ApiResponse<OrderData>;

export type ProductsResponse = ApiResponse<ProductEntity[]>;
export type ProductResponse = ApiResponse<ProductEntity>;

export type EmptySuccessResponse = ApiResponse<{
  success: boolean;
}>;
