import { Router } from "express";

import ApiRoutes from "./api";
import HealthRoute from "./health.route";
import { userAuthenticator } from "../middlewares/user-authenticator";

const router = Router();

router.use(HealthRoute);
router.use("/api", userAuthenticator, ApiRoutes);

export default router;
