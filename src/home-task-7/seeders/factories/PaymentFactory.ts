import type { EntityManager } from "@mikro-orm/core";
import { Factory, Faker } from "@mikro-orm/seeder";

import { Payment } from "../../entities/payment.entity";
import { Order } from "../../entities/order.entity";

export class PaymentFactory extends Factory<Payment> {
  private readonly order: Order;
  model = Payment;

  constructor(em: EntityManager, order: Order) {
    super(em);
    this.order = order;
  }

  definition(faker: Faker): Partial<Payment> {
    return {
      order: this.order,
      type: faker.helpers.arrayElement(["visa", "mastercard", "paypal"]),
      address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()}, ${faker.address.country()}`,
      creditCard: faker.finance.creditCardNumber("####-####-####-####"),
    };
  }
}
