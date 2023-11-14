import { Router } from "express";
import { STATES, connection } from "mongoose";

const router = Router();

router.get("/health", async (req, res, next) => {
  res.status(200).json({
    dbState: STATES[connection.readyState],
    message: "Application is healthy",
  });
});

export default router;
