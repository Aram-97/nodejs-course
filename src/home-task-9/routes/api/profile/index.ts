import { Router } from "express";
import CartRoute from "./cart.routes";

const router = Router();

router.use("/cart", CartRoute);

export default router;
