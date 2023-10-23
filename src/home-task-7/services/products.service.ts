import { ProductsModel } from "../databases/products.db";
import { Product } from "../entities/product.entity";

export async function getProducts(): Promise<Product[]> {
  const data = await new ProductsModel().getProducts();
  return data;
}

export async function getProductById(productId: string): Promise<Product> {
  const data = await new ProductsModel().getProductById(productId);
  return data;
}
