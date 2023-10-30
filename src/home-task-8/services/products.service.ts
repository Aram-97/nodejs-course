import { ProductsModel } from "../databases/products.db";
import { ProductData } from "../model";

export async function getProducts(): Promise<ProductData[]> {
  const products = await new ProductsModel().getProducts();

  return products.map((product) => ({
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    price: product.price,
  }));
}

export async function getProductById(productId: string): Promise<ProductData> {
  const product = await new ProductsModel().getProductById(productId);

  return {
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    price: product.price,
  };
}
