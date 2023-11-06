import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { Request, Response, Router } from "express";

import { UserRole } from "@src/home-task-8/schemas/user.schema";
import { UsersModel } from "@src/home-task-8/databases/users.db";

import { CurrentUser, UserLoginPayload, UserRegisterPayload } from "../model";

const router = Router();

router.post(
  "/register",
  async (req: Request<{}, string, UserRegisterPayload>, res: Response<string>, next) => {
    const { name, email, password, isAdmin } = req.body;

    if (!(name && email && password)) {
      return res.status(400).send("All inputs are required!");
    }

    const model = new UsersModel();
    const oldUser = await model.getUserByEmail(email);

    if (oldUser) {
      return res.status(400).send("User already exists, please login!");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await model.createUser({
      name,
      email,
      password: encryptedPassword,
      role: isAdmin ? UserRole.ADMIN : UserRole.BASIC,
    });

    return res.status(201).send("User successfully registered!");
  }
);

router.post(
  "/login",
  async (
    req: Request<{}, string | { token: string }, UserLoginPayload>,
    res: Response<string | { token: string }>,
    next
  ) => {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("All inputs are required!");
    }

    const model = new UsersModel();
    const user = await model.getUserByEmail(email);

    if (!user) {
      return res.status(400).send("User not found, please register!");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (isPasswordMatched) {
      const currentUser: CurrentUser = {
        user_id: user._id.toString(),
        role: user.role,
        email,
      };
      const token = jwt.sign(currentUser, process.env.JWT_TOKEN_KEY!, { expiresIn: "2h" });

      return res.json({ token });
    }

    return res.status(400).send("Invalid password, please try again!");
  }
);

export default router;
