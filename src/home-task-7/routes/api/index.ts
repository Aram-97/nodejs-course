import { Router } from "express";
import ProfileRoute from "./profile";
import ProductsRoute from "./products.route";

const router = Router();

router.use("/profile", ProfileRoute);
router.use("/products", ProductsRoute);

export default router;
