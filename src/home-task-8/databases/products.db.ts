import { Types } from "mongoose";
import { PopulatedProduct, ProductCollection } from "../schemas/product.schema";

export class ProductsModel {
  async getProducts(): Promise<PopulatedProduct[]> {
    const products = await ProductCollection.find().select({ __v: 0 });

    return products.map((product) => product.toObject());
  }

  async getProductById(productId: string): Promise<PopulatedProduct> {
    const product = await ProductCollection.findById(new Types.ObjectId(productId))
      .select({ __v: 0 })
      .orFail();

    return product.toObject();
  }
}
