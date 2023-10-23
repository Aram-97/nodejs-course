import { Router } from "express";
import CartRoute from "./cart.route";

const router = Router();

router.use("/cart", CartRoute);

export default router;
