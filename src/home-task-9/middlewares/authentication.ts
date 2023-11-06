import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "@src/home-task-8/model";

import { CurrentUser } from "../model";

export async function verifyUserToken<T, U>(
  req: Request<T>,
  res: Response<string | ApiResponse | U>,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send("Authorization token is required!");
    }

    const [tokenType, token] = authHeader.split(" ");

    if (tokenType !== "Bearer") {
      return res.status(403).send("Invalid token type!");
    }

    const user = jwt.verify(token, process.env.JWT_TOKEN_KEY!) as CurrentUser;
    req.user = user;

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const response: ApiResponse = {
        data: null,
        error: { message: `JWT token expired at ${new Date(error.expiredAt)}!` },
      };

      res.status(401).json(response);
    } else if (error instanceof jwt.JsonWebTokenError) {
      const response: ApiResponse = {
        data: null,
        error: { message: `Invalid JWT token! [${error.message}]` },
      };

      res.status(401).json(response);
    } else {
      next(error);
    }
  }
}
