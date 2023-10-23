import { Migration } from '@mikro-orm/migrations';

export class Migration20231019054836 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "order_item" ("order_id" uuid not null, "product_id" uuid not null, "count" int not null, "price" int not null, constraint "order_item_pkey" primary key ("order_id", "product_id"));');

    this.addSql('alter table "order_item" add constraint "order_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;');
    this.addSql('alter table "order_item" add constraint "order_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');

    this.addSql('alter table "user" drop constraint "user_cart_id_foreign";');
    this.addSql('alter table "user" drop constraint "user_payment_id_foreign";');
    this.addSql('alter table "user" drop constraint "user_delivery_id_foreign";');

    this.addSql('alter table "order" drop constraint "order_payment_id_foreign";');
    this.addSql('alter table "order" drop constraint "order_delivery_id_foreign";');

    this.addSql('alter table "user" drop constraint "user_cart_id_unique";');
    this.addSql('alter table "user" drop constraint "user_payment_id_unique";');
    this.addSql('alter table "user" drop constraint "user_delivery_id_unique";');
    this.addSql('alter table "user" drop column "cart_id";');
    this.addSql('alter table "user" drop column "payment_id";');
    this.addSql('alter table "user" drop column "delivery_id";');

    this.addSql('alter table "order" drop column "payment_id";');
    this.addSql('alter table "order" drop column "delivery_id";');

    this.addSql('alter table "payment" add column "order_id" uuid not null;');
    this.addSql('alter table "payment" add constraint "payment_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;');
    this.addSql('alter table "payment" add constraint "payment_order_id_unique" unique ("order_id");');

    this.addSql('alter table "delivery" add column "order_id" uuid not null;');
    this.addSql('alter table "delivery" add constraint "delivery_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;');
    this.addSql('alter table "delivery" add constraint "delivery_order_id_unique" unique ("order_id");');

    this.addSql('alter table "cart" add column "user_id" uuid not null;');
    this.addSql('alter table "cart" add constraint "cart_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "cart" add constraint "cart_user_id_unique" unique ("user_id");');

    this.addSql('alter table "cart_item" add column "price" int not null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "order_item" cascade;');

    this.addSql('alter table "cart" drop constraint "cart_user_id_foreign";');

    this.addSql('alter table "delivery" drop constraint "delivery_order_id_foreign";');

    this.addSql('alter table "payment" drop constraint "payment_order_id_foreign";');

    this.addSql('alter table "cart" drop constraint "cart_user_id_unique";');
    this.addSql('alter table "cart" drop column "user_id";');

    this.addSql('alter table "delivery" drop constraint "delivery_order_id_unique";');
    this.addSql('alter table "delivery" drop column "order_id";');

    this.addSql('alter table "payment" drop constraint "payment_order_id_unique";');
    this.addSql('alter table "payment" drop column "order_id";');

    this.addSql('alter table "cart_item" drop column "price";');

    this.addSql('alter table "user" add column "cart_id" uuid not null, add column "payment_id" uuid not null, add column "delivery_id" uuid not null;');
    this.addSql('alter table "user" add constraint "user_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade;');
    this.addSql('alter table "user" add constraint "user_payment_id_foreign" foreign key ("payment_id") references "payment" ("id") on update cascade;');
    this.addSql('alter table "user" add constraint "user_delivery_id_foreign" foreign key ("delivery_id") references "delivery" ("id") on update cascade;');
    this.addSql('alter table "user" add constraint "user_cart_id_unique" unique ("cart_id");');
    this.addSql('alter table "user" add constraint "user_payment_id_unique" unique ("payment_id");');
    this.addSql('alter table "user" add constraint "user_delivery_id_unique" unique ("delivery_id");');

    this.addSql('alter table "order" add column "payment_id" uuid not null, add column "delivery_id" uuid not null;');
    this.addSql('alter table "order" add constraint "order_payment_id_foreign" foreign key ("payment_id") references "payment" ("id") on update cascade;');
    this.addSql('alter table "order" add constraint "order_delivery_id_foreign" foreign key ("delivery_id") references "delivery" ("id") on update cascade;');
  }

}
