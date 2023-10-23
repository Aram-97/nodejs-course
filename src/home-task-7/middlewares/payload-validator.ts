import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { ApiResponse } from "../model";

export const payloadValidator = (schema: joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
      return;
    }

    const message = error.details.map((item) => item.message).join(",");
    const response: ApiResponse = { data: null, error: { message } };

    res.status(400).json(response);
  };
};
