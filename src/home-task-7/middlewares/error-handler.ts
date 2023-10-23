import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../model";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({
    data: null,
    error: { message: error.message ?? "Ooops, something went wrong", traces: error.stack },
  } as ApiResponse);
};
