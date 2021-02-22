import { Migration } from '@mikro-orm/migrations';

export class Migration20210222165348 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "password" to "hashed_password";');
  }

}
