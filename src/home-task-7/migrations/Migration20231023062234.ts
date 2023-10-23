import { Migration } from '@mikro-orm/migrations';

export class Migration20231023062234 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "order_item" drop constraint "order_item_pkey";');
    this.addSql('alter table "order_item" drop column "id";');
    this.addSql('alter table "order_item" add constraint "order_item_pkey" primary key ("order_id", "product_id");');

    this.addSql('alter table "cart_item" drop constraint "cart_item_pkey";');
    this.addSql('alter table "cart_item" drop column "id";');
    this.addSql('alter table "cart_item" add constraint "cart_item_pkey" primary key ("cart_id", "product_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order_item" add column "id" uuid not null default uuid_generate_v4();');
    this.addSql('alter table "order_item" drop constraint "order_item_pkey";');
    this.addSql('alter table "order_item" add constraint "order_item_pkey" primary key ("id", "order_id", "product_id");');

    this.addSql('alter table "cart_item" add column "id" uuid not null default uuid_generate_v4();');
    this.addSql('alter table "cart_item" drop constraint "cart_item_pkey";');
    this.addSql('alter table "cart_item" add constraint "cart_item_pkey" primary key ("id", "cart_id", "product_id");');
  }

}
