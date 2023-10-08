import { NextFunction, Request, Response } from "express";
import { UsersModel } from "../databases/users.db";
import { ApiResponse } from "../model";

export async function userAuthenticator(req: Request, res: Response, next: NextFunction) {
  const userId = req.get("x-user-id");
  const users = await new UsersModel().getUsers();
  const isAuthorized = users.some((user) => user.id === userId);

  if (!isAuthorized) {
    const response: ApiResponse = {
      data: null,
      error: { message: "Header x-user-id is missing or no user with such id" },
    };

    res.status(401).json(response);
    return;
  }

  next();
}
