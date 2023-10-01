import UserController from "../../controller";
import { HTTP_METHOD, Route } from "../../model";
import { getRequestBody, handleRequestError } from "../../utils";

export const CREATE_USER_ROUTE: Route = {
  method: HTTP_METHOD.POST,
  path: "/api/users",
  async resolver(req, res) {
    try {
      const body = await getRequestBody(req);
      const data = await JSON.parse(body);
      const newUser = await new UserController().createUser(data);

      res.statusCode = 200;
      res.end(JSON.stringify(newUser));
    } catch (error) {
      handleRequestError(res, error);
    }
  },
};
