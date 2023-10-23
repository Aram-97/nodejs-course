import http from "http";
import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { EntityManager, EntityRepository, MikroORM, RequestContext } from "@mikro-orm/core";

import { PORT } from "./env";
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

const app = express();

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
})();
