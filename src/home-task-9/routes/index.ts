import { Router } from "express";

import ApiRoutes from "./api";
import AuthRoutes from "./auth.routes";
import { verifyUserToken } from "../middlewares/authentication";

const router = Router();

router.use(AuthRoutes);
router.use("/api", verifyUserToken, ApiRoutes);

export default router;
