import UserController from "../../controller";
import { HTTP_METHOD, Route } from "../../model";
import { getRequestBody, handleRequestError } from "../../utils";

export const DELETE_USER_ROUTE: Route = {
  method: HTTP_METHOD.DELETE,
  path: "/api/users/{id}",
  async resolver(req, res, ...params) {
    try {
      const [id] = params;
      const message = await new UserController().deleteUser(id);

      res.statusCode = 200;
      res.end(JSON.stringify(message));
    } catch (error) {
      handleRequestError(res, error);
    }
  },
};
