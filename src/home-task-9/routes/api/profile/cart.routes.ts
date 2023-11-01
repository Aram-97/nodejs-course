import { Request, Response, Router } from "express";

import {
  CartPayload,
  CartResponse,
  EmptySuccessResponse,
  OrderPayload,
  OrderResponse,
} from "@src/home-task-8/model";
import {
  getCartByUser,
  createCart,
  deleteCart,
  checkoutCart,
  updateProductInCart,
} from "@src/home-task-8/services/cart.service";
import { payloadValidator } from "@src/home-task-8/middlewares/payload-validator";
import { isAdmin } from "@src/home-task-9/middlewares/authorization";
import { VALIDATORS } from "@src/home-task-8/validator";

const router = Router();

router.post("/", async (req, res: Response<CartResponse>, next) => {
  try {
    const userId = req.user.user_id;
    const data = await createCart(userId);

    res.status(201).json({ data, error: null });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res: Response<CartResponse>, next) => {
  try {
    const userId = req.user.user_id;
    const { cart, totalPrice, isCreated } = await getCartByUser(userId);

    if (isCreated) {
      res.status(201);
    }

    res.json({
      data: { cart, totalPrice },
      error: null,
    });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/",
  payloadValidator(VALIDATORS.updateProductInCart),
  async (req: Request<{}, CartResponse, CartPayload>, res: Response<CartResponse>, next) => {
    try {
      const payload = req.body;
      const userId = req.user.user_id;
      const data = await updateProductInCart(userId, payload);

      res.json({ data, error: null });
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:userId", isAdmin, async (req, res: Response<EmptySuccessResponse>, next) => {
  try {
    const { userId } = req.params;
    const success = await deleteCart(userId);

    res.json({ data: { success }, error: null });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/checkout",
  async (req: Request<{}, OrderResponse, OrderPayload>, res: Response<OrderResponse>, next) => {
    try {
      const payload = req.body;
      const userId = req.user.user_id;
      const data = await checkoutCart(userId, payload);

      res.json({ data, error: null });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
