import { Request, Response, Router } from "express";
import {
  CartPayload,
  CartResponse,
  EmptySuccessResponse,
  OrderPayload,
  OrderResponse,
} from "../../../model";
import {
  getCartByUser,
  createCart,
  deleteCart,
  checkoutCart,
  updateProductInCart,
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
      const userId = req.get("x-user-id")!;
      const data = await updateProductInCart(userId, payload);

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

router.post(
  "/checkout",
  async (req: Request<{}, OrderResponse, OrderPayload>, res: Response<OrderResponse>, next) => {
    try {
      const payload = req.body;
      const userId = req.get("x-user-id")!;
      const data = await checkoutCart(userId, payload);

      res.json({ data, error: null });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
