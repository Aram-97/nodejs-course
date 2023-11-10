import http from "http";
import * as dotenv from "dotenv";

import { routeResolver } from "./resolver";

dotenv.config();

const PORT = process.env.PORT || 3000;

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
