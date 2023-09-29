import http from "http";
import { APP_ROUTES } from "./routes";
import { Route } from "./model";

export const resolveRoute = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
): Route | null => {
  let resolvedRoute = null;

  for (let route of APP_ROUTES) {
    const pathRegex = route.path.replaceAll(/{\w+}/g, "(\\w+)").concat("$");
    const matches = new RegExp(pathRegex).exec(req.url ?? "");

    if (req.method === route.method && Array.isArray(matches)) {
      const params = [...matches].slice(1);

      route.resolver(req, res, ...params);
      resolvedRoute = route;
      break;
    }
  }

  return resolvedRoute;
};
