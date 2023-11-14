import { Router } from "express";

import { requestLogger } from "@src/home-task-8/middlewares/request-logger";

import ApiRoutes from "./api";
import AuthRoutes from "./auth.routes";
import HealthRoute from "./health.route";
import { verifyUserToken } from "../middlewares/authentication";

const router = Router();

router.use(requestLogger);
router.use(AuthRoutes);
router.use(HealthRoute);
router.use("/api", verifyUserToken, ApiRoutes);

export default router;
