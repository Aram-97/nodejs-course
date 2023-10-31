import { Require_id, Schema, model } from "mongoose";

export interface ProductSchema {
  title: string;
  description: string;
  price: number;
}

export type PopulatedProduct = Require_id<ProductSchema>;

const schema = new Schema<ProductSchema>({
  title: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  description: String,
});

export const ProductCollection = model<ProductSchema>("Product", schema);
