import { Migration } from '@mikro-orm/migrations';

export class Migration20210304182440 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "is_admin" bool not null default false;');
  }

}
