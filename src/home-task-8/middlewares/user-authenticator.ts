import { Error } from 'mongoose';
import { NextFunction, Request, Response } from "express";
import { UsersModel } from "../databases/users.db";
import { ApiResponse } from "../model";

export async function userAuthenticator(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.get("x-user-id");
    const user = await new UsersModel().getUserById(userId);

    if (user) {
      next();
    }
  } catch (error) {
    if (error instanceof Error.DocumentNotFoundError) {
      const response: ApiResponse = {
        data: null,
        error: { message: "Header x-user-id is missing or no user with such id" },
      };

      res.status(401).json(response);
    } else {
      next(error);
    }
  }
}
