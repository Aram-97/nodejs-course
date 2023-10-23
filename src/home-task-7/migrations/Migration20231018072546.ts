import { Migration } from '@mikro-orm/migrations';

export class Migration20231018072546 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "cart" ("id" uuid not null default uuid_generate_v4(), "is_deleted" boolean not null default false, constraint "cart_pkey" primary key ("id"));');

    this.addSql('create table "delivery" ("id" uuid not null default uuid_generate_v4(), "type" varchar(255) not null, "address" varchar(255) not null, constraint "delivery_pkey" primary key ("id"));');

    this.addSql('create table "payment" ("id" uuid not null default uuid_generate_v4(), "type" varchar(255) not null, "address" varchar(255) not null, "credit_card" varchar(255) not null, constraint "payment_pkey" primary key ("id"));');

    this.addSql('create table "product" ("id" uuid not null default uuid_generate_v4(), "title" varchar(255) not null, "description" varchar(255) not null, "price" int not null, constraint "product_pkey" primary key ("id"));');

    this.addSql('create table "cart_item" ("cart_id" uuid not null, "product_id" uuid not null, "count" int not null, constraint "cart_item_pkey" primary key ("cart_id", "product_id"));');

    this.addSql('create table "user" ("id" uuid not null default uuid_generate_v4(), "cart_id" uuid not null, "payment_id" uuid not null, "delivery_id" uuid not null, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_cart_id_unique" unique ("cart_id");');
    this.addSql('alter table "user" add constraint "user_payment_id_unique" unique ("payment_id");');
    this.addSql('alter table "user" add constraint "user_delivery_id_unique" unique ("delivery_id");');

    this.addSql('create table "order" ("id" uuid not null default uuid_generate_v4(), "user_id" uuid not null, "comments" varchar(255) null, "status" text check ("status" in (\'created\', \'completed\')) not null, "total_price" int not null, "payment_id" uuid not null, "delivery_id" uuid not null, constraint "order_pkey" primary key ("id"));');

    this.addSql('alter table "cart_item" add constraint "cart_item_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade;');
    this.addSql('alter table "cart_item" add constraint "cart_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');

    this.addSql('alter table "user" add constraint "user_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade;');
    this.addSql('alter table "user" add constraint "user_payment_id_foreign" foreign key ("payment_id") references "payment" ("id") on update cascade;');
    this.addSql('alter table "user" add constraint "user_delivery_id_foreign" foreign key ("delivery_id") references "delivery" ("id") on update cascade;');

    this.addSql('alter table "order" add constraint "order_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "order" add constraint "order_payment_id_foreign" foreign key ("payment_id") references "payment" ("id") on update cascade;');
    this.addSql('alter table "order" add constraint "order_delivery_id_foreign" foreign key ("delivery_id") references "delivery" ("id") on update cascade;');
  }

}
