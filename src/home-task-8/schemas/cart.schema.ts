import { Require_id, Schema, Types, model } from "mongoose";
import { PopulatedProduct } from "./product.schema";
import { PopulatedUser } from "./user.schema";

export interface CartItemSchema {
  product: Types.ObjectId;
  price: number;
  count: number;
}

export type PopulatedCartItem = Omit<CartItemSchema, "product"> & { product: PopulatedProduct };

export interface CartSchema {
  user: Types.ObjectId;
  isDeleted: boolean;
  items: CartItemSchema[];
}

export type PopulatedCart = Require_id<
  Omit<CartSchema, "user" | "items"> & {
    user: PopulatedUser;
    items: PopulatedCartItem[];
  }
>;

const schema = new Schema<CartSchema>({
  user: { type: Schema.Types.ObjectId, ref: "User", unique: true },
  isDeleted: { type: Boolean, default: false },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
      price: { type: Number, required: true },
      count: { type: Number, required: true },
    },
  ],
});

export const CartCollection = model<CartSchema>("Cart", schema);
