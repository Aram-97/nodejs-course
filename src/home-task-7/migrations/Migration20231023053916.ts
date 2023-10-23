import { Migration } from '@mikro-orm/migrations';

export class Migration20231023053916 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "order" drop column "cart_id";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order" add column "cart_id" varchar null default null;');
  }

}
