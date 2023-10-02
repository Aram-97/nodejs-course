import fs from "fs";
import { APP_DATA_DIR_PATH, PRODUCTS_FILE_NAME } from "../env";
import { ProductEntity } from "../schemas/product.entity";

export class ProductsModel {
  FILE_PATH = APP_DATA_DIR_PATH.concat(PRODUCTS_FILE_NAME);

  async getProducts(): Promise<ProductEntity[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.FILE_PATH, (error, data) => {
        if (error) {
          reject(error);
          return;
        }

        try {
          const products: ProductEntity[] = JSON.parse(data.toString());
          resolve(products);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  async getProductById(productId: string): Promise<ProductEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        const products = await this.getProducts();
        const product = products.find((item) => item.id === productId);

        if (product) {
          resolve(product);
        } else {
          reject();
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
