import { Router } from "express";
import ApiRoutes from "./api";
import { userAuthenticator } from "../middlewares/user-authenticator";

const router = Router();

router.use("/api", userAuthenticator, ApiRoutes);

export default router;
