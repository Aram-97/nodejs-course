import { Require_id, Schema, Types, model } from "mongoose";
import { PopulatedUser } from "./user.schema";
import { PopulatedCart } from "./cart.schema";
import { PopulatedProduct } from "./product.schema";

export enum ORDER_STATUS {
  CREATED = "created",
  COMPLETED = "completed",
}

export interface PaymentSchema {
  type: string;
  address: string;
  credit_card: string;
}

export interface DeliverySchema {
  type: string;
  address: string;
}

export interface OrderItemSchema {
  product: Types.ObjectId;
  price: number;
  count: number;
}

export type PopulatedOrderItem = Omit<OrderItemSchema, "product"> & { product: PopulatedProduct };

export interface OrderSchema {
  user: Types.ObjectId;
  cart: Types.ObjectId;
  items: OrderItemSchema[];
  payment: PaymentSchema;
  delivery: DeliverySchema;
  comments: string;
  status: ORDER_STATUS;
  totalPrice: number;
}

export type PopulatedOrder = Require_id<
  Omit<OrderSchema, "user" | "cart" | "items"> & {
    user: PopulatedUser;
    cart: PopulatedCart;
    items: PopulatedOrderItem[];
  }
>;

const schema = new Schema<OrderSchema>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  cart: { type: Schema.Types.ObjectId, ref: "Cart", required: true, unique: true },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
      price: { type: Number, required: true },
      count: { type: Number, required: true },
    },
  ],
  payment: {
    type: { type: String, required: true },
    address: { type: String, required: true },
    credit_card: { type: String, required: true },
  },
  delivery: {
    type: { type: String, required: true },
    address: { type: String, required: true },
  },
  status: { type: String, enum: Object.values(ORDER_STATUS), required: true },
  totalPrice: { type: Number, required: true },
  comments: String,
});

export const OrderCollection = model<OrderSchema>("Order", schema);
