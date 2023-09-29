import UserController from "../../controller";
import { HTTP_METHOD, DataWithHypermediaLinks, Route } from "../../model";
import { handleRequestError } from "../../utils";

export const GET_USER_BY_ID_ROUTE: Route = {
  method: HTTP_METHOD.GET,
  path: "/api/User/{id}",
  async resolver(req, res, ...params) {
    try {
      const [id] = params;
      const user = await new UserController().getUserById(id);

      const userWithLinks: DataWithHypermediaLinks<typeof user> = {
        ...user,
        links: [
          {
            method: HTTP_METHOD.GET,
            href: `/api/User/${id}/Hobbies`,
            rel: "hobbies",
          },
        ],
      };

      res.statusCode = 200;
      res.end(JSON.stringify(userWithLinks));
    } catch (error) {
      handleRequestError(res, error);
    }
  },
};
