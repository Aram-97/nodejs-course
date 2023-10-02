import http from "http";
import { PORT } from "./env";
import { routeResolver } from "./resolver";

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const matchedRoute = routeResolver(req, res);

  if (!matchedRoute) {
    res.statusCode = 404;
    res.end(JSON.stringify("Route not found!"));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
