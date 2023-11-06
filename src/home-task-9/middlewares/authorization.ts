import { NextFunction, Request, Response } from "express";

import { UserRole } from "@src/home-task-8/schemas/user.schema";

export async function isAdmin<T, U>(
  req: Request<T>,
  res: Response<string | U>,
  next: NextFunction
) {
  const { role } = req.user;

  if (role !== UserRole.ADMIN) {
    return res.status(403).send("Only admin users are allowed to perform this operation!");
  }

  next();
}
