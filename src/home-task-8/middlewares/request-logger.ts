import { NextFunction, Request, Response } from "express";
import { LOGGER } from "@src/home-task-10/logger";

export async function requestLogger(req: Request, res: Response, next: NextFunction) {
  LOGGER.info("Incoming request!", { method: req.method, path: req.path });

  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    LOGGER.info("Outgoing response!", { method: req.method, path: req.path, duration });
  });

  next();
}
