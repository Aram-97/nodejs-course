import UserController from "../../controller";
import { HTTP_METHOD, Route } from "../../model";

export const GET_USERS_ROUTE: Route = {
  method: HTTP_METHOD.GET,
  path: "/api/Users",
  async resolver(req, res) {
    const users = await new UserController().getUsers();

    res.statusCode = 200;
    res.end(JSON.stringify(users));
  },
};
