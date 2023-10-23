import { Response, Router } from "express";
import { NotFoundError } from "@mikro-orm/core";

import { getProductById, getProducts } from "../../services/products.service";
import { ProductResponse, ProductsResponse } from "../../model";

const router = Router();

router.get("/", async (req, res: Response<ProductsResponse>, next) => {
  const products = await getProducts();

  res.json({
    data: products,
    error: null,
  });
});

router.get("/:productId", async (req, res: Response<ProductResponse>, next) => {
  try {
    const { productId } = req.params;
    const product = await getProductById(productId);

    res.json({
      data: product,
      error: null,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        data: null,
        error: {
          message: "No product with such id",
        },
      });
    } else {
      next(error);
    }
  }
});

export default router;
