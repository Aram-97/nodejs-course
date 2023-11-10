import { Router } from "express";

import { DI } from "../app";

const router = Router();

router.get("/health", async (req, res, next) => {
  const isConnected = await DI.orm.isConnected();

  res.status(200).json({
    dbState: isConnected ? "connected" : "disconnected",
    message: "Application is healthy",
  });
});

export default router;
