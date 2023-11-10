import http from "http";
import "reflect-metadata";
import express from "express";
import util from "util";
import { Socket } from "net";
import * as dotenv from "dotenv";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { EntityManager, EntityRepository, MikroORM, RequestContext } from "@mikro-orm/core";

import AppRoutes from "./routes";
import { errorHandler } from "./middlewares/error-handler";
import config from "./mikro-orm.config";
import { User } from "./entities/user.entity";
import { Order } from "./entities/order.entity";
import { Cart } from "./entities/cart.entity";
import { Product } from "./entities/product.entity";
import { Payment } from "./entities/payment.entity";
import { Delivery } from "./entities/delivery.entity";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  userRepo: EntityRepository<User>;
  orderRepo: EntityRepository<Order>;
  cartRepo: EntityRepository<Cart>;
  productRepo: EntityRepository<Product>;
  paymentRepo: EntityRepository<Payment>;
  deliveryRepo: EntityRepository<Delivery>;
};

function setupGracefulShutdown() {
  let connections: Socket[] = [];

  DI.server.on("connection", (connection) => {
    connections.push(connection);
    console.log("Received a new connection!", connection.address());

    connection.on("close", () => {
      connections = connections.filter((current) => current !== connection);
      console.log("Connection closed!");
    });
  });

  async function shutdown() {
    console.log("Received kill signal, shutting down gracefully");

    await DI.orm.close();
    console.log("Disconnected from PostgreSQL database!");

    DI.server.close(() => {
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
}

export const init = (async () => {
  DI.orm = await MikroORM.init<PostgreSqlDriver>(config);
  DI.em = DI.orm.em;

  DI.userRepo = DI.orm.em.getRepository(User);
  DI.orderRepo = DI.orm.em.getRepository(Order);
  DI.cartRepo = DI.orm.em.getRepository(Cart);
  DI.productRepo = DI.orm.em.getRepository(Product);
  DI.paymentRepo = DI.orm.em.getRepository(Payment);
  DI.deliveryRepo = DI.orm.em.getRepository(Delivery);

  app.use(express.json());
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
  app.use(AppRoutes);
  app.use(errorHandler);

  DI.server = app.listen(PORT, () => {
    console.log(`MikroORM express TS example started at http://localhost:${PORT}`);
  });

  util.debuglog("app-mikro-orm")("MikroORM app started on port [%d]", PORT);

  setupGracefulShutdown();
})();
