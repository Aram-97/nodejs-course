import http from "http";
import { APP_ROUTES } from "./routes";
import { Route } from "./model";

export const routeResolver = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
): Route | null => {
  let matchedRoute = null;

  for (let route of APP_ROUTES) {
    const pathRegex = route.path.replaceAll(/{\w+}/g, "(\\w+)").concat("$");
    const matches = new RegExp(pathRegex).exec(req.url?.toLowerCase() ?? "");

    if (req.method === route.method && Array.isArray(matches)) {
      const params = [...matches].slice(1);

      route.resolver(req, res, ...params);
      matchedRoute = route;
      break;
    }
  }

  return matchedRoute;
};
