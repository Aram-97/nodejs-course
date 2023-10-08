import { Request, Response, Router } from "express";
import { CartPayload, CartResponse, EmptySuccessResponse, OrderResponse } from "../../../model";
import {
  checkoutCart,
  createCart,
  deleteCart,
  getCart,
  updateCart,
} from "../../../services/cart.service";
import { payloadValidator } from "../../../middlewares/payload-validator";
import { VALIDATORS } from "../../../validator";

const router = Router();

router.post("/", async (req, res: Response<CartResponse>, next) => {
  try {
    const userId = req.get("x-user-id")!;
    const data = await createCart(userId);

    res.status(201).json({ data, error: null });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res: Response<CartResponse>, next) => {
  try {
    const userId = req.get("x-user-id")!;
    const { cart, totalPrice, isCreated } = await getCart(userId);

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
  payloadValidator(VALIDATORS.updateCart),
  async (req: Request<{}, CartResponse, CartPayload>, res: Response<CartResponse>, next) => {
    try {
      const payload = req.body;
      const userId = req.get("x-user-id")!;
      const data = await updateCart(userId, payload.items);

      res.json({ data, error: null });
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/", async (req, res: Response<EmptySuccessResponse>, next) => {
  try {
    const userId = req.get("x-user-id")!;
    const success = await deleteCart(userId);

    res.json({ data: { success }, error: null });
  } catch (error) {
    next(error);
  }
});

router.post("/checkout", async (req, res: Response<OrderResponse>, next) => {
  try {
    const userId = req.get("x-user-id")!;
    const data = await checkoutCart(userId);

    res.json({ data, error: null });
  } catch (error) {
    next(error);
  }
});

export default router;
