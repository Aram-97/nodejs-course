import UserController from "../../../controller";
import { HTTP_METHOD, Route } from "../../../model";
import { handleRequestError } from "../../../utils";

export const GET_USER_HOBBIES_ROUTE: Route = {
  method: HTTP_METHOD.GET,
  path: "/api/User/{id}/Hobbies",
  async resolver(req, res, ...params) {
    try {
      const [id] = params;
      const hobbies = await new UserController().getUserHobbies(id);

      res.writeHead(200, { "Cache-Control": "max-age=604800, no-cache" });
      res.end(JSON.stringify(hobbies));
    } catch (error) {
      handleRequestError(res, error);
    }
  },
};
