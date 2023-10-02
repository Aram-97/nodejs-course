import UserController from "../../controller";
import { HTTP_METHOD, Route } from "../../model";
import { getRequestBody, handleRequestError } from "../../utils";

export const UPDATE_USER_ROUTE: Route = {
  method: HTTP_METHOD.PUT,
  path: "/api/users/{id}",
  async resolver(req, res, ...params) {
    try {
      const [id] = params;
      const body = await getRequestBody(req);
      const data = await JSON.parse(body);
      const updatedUser = await new UserController().updateUser(id, data);

      res.statusCode = 200;
      res.end(JSON.stringify(updatedUser));
    } catch (error) {
      handleRequestError(res, error);
    }
  },
};
