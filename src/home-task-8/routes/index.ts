import { Router } from "express";
import ApiRoutes from "./api";
import HealthRoute from "./health.route";
import { userAuthenticator } from "../middlewares/user-authenticator";
import { requestLogger } from "../middlewares/request-logger";

const router = Router();

router.use(requestLogger);
router.use(HealthRoute);
router.use("/api", userAuthenticator, ApiRoutes);

export default router;
