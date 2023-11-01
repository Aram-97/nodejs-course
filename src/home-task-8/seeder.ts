import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import { connect, disconnect } from "mongoose";

import { MONGO_DB_CONNECTION_STRING, MONGO_DB_DATABASE_NAME, PORT } from "./env";
import { UserCollection, UserRole } from "./schemas/user.schema";
import { ProductCollection } from "./schemas/product.schema";

const seedUsers = async (amount: number) => {
  try {
    const fakeUsers = await Promise.all(
      Array.from({ length: amount }, async () => {
        const firstName = faker.helpers.unique(faker.name.firstName);
        const lastName = faker.helpers.unique(faker.name.lastName);
        const name = `${firstName} ${lastName}`;
        const password = await bcrypt.hash(name, 10);

        const user = new UserCollection({
          name,
          password,
          email: faker.internet.email(firstName, lastName),
          role: faker.helpers.arrayElement(Object.values(UserRole)),
        });

        return user;
      })
    );

    await Promise.all(fakeUsers.map((user) => user.save()));
    console.log(`Database has been seeded with ${amount} users!`);
  } catch (error) {
    console.error(error);
  }
};

const seedProducts = async (amount: number) => {
  try {
    const fakeProducts = Array.from({ length: amount }, () => {
      const product = new ProductCollection({
        title: faker.helpers.unique(faker.commerce.product),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price(10, 200, 0)),
      });

      return product;
    });

    await Promise.all(fakeProducts.map((product) => product.save()));
    console.log(`Database has been seeded with ${amount} products!`);
  } catch (error) {
    console.error(error);
  }
};

export const seeder = (async () => {
  try {
    await connect(MONGO_DB_CONNECTION_STRING, { dbName: MONGO_DB_DATABASE_NAME });
    console.log("Connected to Mongo DB!");

    await seedUsers(5);
    await seedProducts(10);

    await disconnect();
    console.log("Disconnected from Mongo DB!");

    return process.exit(0);
  } catch (error) {
    console.error(error);
    return process.exit(1);
  }
})();
