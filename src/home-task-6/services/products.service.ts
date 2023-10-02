import { ProductsModel } from "../databases/products.db";
import { ProductEntity } from "../schemas/product.entity";

export async function getProducts(): Promise<ProductEntity[]> {
  const data = await new ProductsModel().getProducts();
  return data;
}

export async function getProductById(productId: string): Promise<ProductEntity> {
  const data = await new ProductsModel().getProductById(productId);
  return data;
}
