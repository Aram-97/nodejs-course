import express from "express";
import * as dotenv from "dotenv";
import { connect, disconnect } from "mongoose";

import { errorHandler } from "@src/home-task-8/middlewares/error-handler";
import { MONGO_DB_CONNECTION_STRING, MONGO_DB_DATABASE_NAME, PORT } from "@src/home-task-8/env";

import AppRoutes from "./routes";

dotenv.config();

const app = express();

export const main = (async () => {
  try {
    await connect(MONGO_DB_CONNECTION_STRING, { dbName: MONGO_DB_DATABASE_NAME });
    console.log("Connected to Mongo DB!");
  } catch (error) {
    console.error(error);
  }

  app.use(express.json());
  app.use(AppRoutes);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  app.on("close", async () => {
    await disconnect();
  });
})();
