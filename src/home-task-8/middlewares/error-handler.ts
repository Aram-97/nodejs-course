import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../model";
import { LOGGER } from "@src/home-task-10/logger";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  LOGGER.error("Encounter error!", { error: error.message, stacktrace: error.stack });

  res.status(500).send({
    data: null,
    error: { message: error.message ?? "Ooops, something went wrong", traces: error.stack },
  } as ApiResponse);
};
