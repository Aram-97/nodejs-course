import express from "express";
import * as dotenv from "dotenv";
import { Socket } from "net";

import AppRoutes from "./routes";
import { errorHandler } from "./middlewares/error-handler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

let connections: Socket[] = [];

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.json());

app.use(AppRoutes);
app.use(errorHandler);

server.on("connection", (connection) => {
  connections.push(connection);
  console.log("Received a new connection!", connection.address());

  connection.on("close", () => {
    connections = connections.filter((current) => current !== connection);
    console.log("Connection closed!");
  });
});

function shutdown() {
  console.log("Received kill signal, shutting down gracefully");

  server.close(() => {
    console.log("Closed out remaining connections!");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down!");
    process.exit(1);
  }, 20000);

  connections.forEach((connection) => {
    connection.end();
    console.log("Connection forcefully closed!");
  });

  setTimeout(() => {
    connections.forEach((connection) => connection.destroy());
  }, 10000);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
