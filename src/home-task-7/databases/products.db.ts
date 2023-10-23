import { QueryOrder } from "@mikro-orm/core";

import { DI } from "../app";

export class ProductsModel {
  async getProducts() {
    const products = await DI.productRepo.findAll({
      orderBy: { title: QueryOrder.DESC },
      limit: 100,
    });

    return products;
  }

  async getProductById(id: string) {
    const product = await DI.productRepo.findOneOrFail(id);

    return product;
  }
}
