import type { EntityManager } from "@mikro-orm/core";
import { Factory, Faker } from "@mikro-orm/seeder";

import { Delivery } from "../../entities/delivery.entity";
import { Order } from "../../entities/order.entity";

export class DeliveryFactory extends Factory<Delivery> {
  private readonly order: Order;
  model = Delivery;

  constructor(em: EntityManager, order: Order) {
    super(em);
    this.order = order;
  }

  definition(faker: Faker): Partial<Delivery> {
    return {
      order: this.order,
      type: faker.helpers.arrayElement(["free", "standard", "express"]),
      address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()}, ${faker.address.country()}`,
    };
  }
}
