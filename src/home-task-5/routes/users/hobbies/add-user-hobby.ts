import UserController from "../../../controller";
import { HTTP_METHOD, Route } from "../../../model";
import { handleRequestError } from "../../../utils";

export const ADD_USER_HOBBY_ROUTE: Route = {
  method: HTTP_METHOD.PUT,
  path: "/api/users/{id}/hobbies/{hobby}",
  async resolver(req, res, ...params) {
    try {
      const [id, hobby] = params;
      const updatedHobbies = await new UserController().addUserHobby(id, hobby);

      res.statusCode = 200;
      res.end(JSON.stringify(updatedHobbies));
    } catch (error) {
      handleRequestError(res, error);
    }
  },
};
