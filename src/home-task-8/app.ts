import express from "express";
import util from "util";
import { Socket } from "net";
import * as dotenv from "dotenv";
import { connect, disconnect } from "mongoose";

import AppRoutes from "./routes";
import { errorHandler } from "./middlewares/error-handler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

export const main = (async () => {
  try {
    await connect(process.env.MONGO_DB_CONNECTION_STRING!, {
      dbName: process.env.MONGO_DB_DATABASE_NAME!,
    });
    console.log("Connected to Mongo DB!");
  } catch (error) {
    console.error(error);
  }

  app.use(express.json());
  app.use(AppRoutes);
  app.use(errorHandler);

  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  util.debuglog("app-mongoose")("Mongoose app started on port [%d]", PORT);

  let connections: Socket[] = [];

  server.on("connection", (connection) => {
    connections.push(connection);
    console.log("Received a new connection!", connection.address());

    connection.on("close", () => {
      connections = connections.filter((current) => current !== connection);
      console.log("Connection closed!");
    });
  });

  async function shutdown() {
    console.log("Received kill signal, shutting down gracefully");

    await disconnect();
    console.log("Disconnected from Mongo DB!");

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
})();
