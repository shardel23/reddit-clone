import { MigrationInterface, QueryRunner } from "typeorm";

export class IntroducingComments21617175648652 implements MigrationInterface {
  name = "IntroducingComments21617175648652";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" SERIAL NOT NULL, "ownerId" integer NOT NULL, "postId" integer NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_10182c1bb8ca0a573d03a2f9c08" PRIMARY KEY ("id", "ownerId", "postId"))`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "PK_10182c1bb8ca0a573d03a2f9c08"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "PK_15d3d3caadab449b2ffe3b4f05b" PRIMARY KEY ("ownerId", "postId")`
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "PK_15d3d3caadab449b2ffe3b4f05b"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "PK_94a85bb16d24033a2afdd5df060" PRIMARY KEY ("postId")`
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "ownerId"`);
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "comment" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "PK_94a85bb16d24033a2afdd5df060"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "PK_f685613ae59fda2ac1e490c9189" PRIMARY KEY ("postId", "id")`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "ownerId" integer NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "PK_f685613ae59fda2ac1e490c9189"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "PK_10182c1bb8ca0a573d03a2f9c08" PRIMARY KEY ("postId", "id", "ownerId")`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "PK_10182c1bb8ca0a573d03a2f9c08"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "PK_10182c1bb8ca0a573d03a2f9c08" PRIMARY KEY ("id", "ownerId", "postId")`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_b8804d1590ac402b52f3e945162" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_b8804d1590ac402b52f3e945162"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "PK_10182c1bb8ca0a573d03a2f9c08"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "PK_10182c1bb8ca0a573d03a2f9c08" PRIMARY KEY ("postId", "id", "ownerId")`
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "PK_10182c1bb8ca0a573d03a2f9c08"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "PK_f685613ae59fda2ac1e490c9189" PRIMARY KEY ("postId", "id")`
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "ownerId"`);
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "PK_f685613ae59fda2ac1e490c9189"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "PK_94a85bb16d24033a2afdd5df060" PRIMARY KEY ("postId")`
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "ownerId" integer NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "PK_94a85bb16d24033a2afdd5df060"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "PK_15d3d3caadab449b2ffe3b4f05b" PRIMARY KEY ("ownerId", "postId")`
    );
    await queryRunner.query(`ALTER TABLE "comment" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "PK_15d3d3caadab449b2ffe3b4f05b"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "PK_10182c1bb8ca0a573d03a2f9c08" PRIMARY KEY ("id", "ownerId", "postId")`
    );
    await queryRunner.query(`DROP TABLE "comment"`);
  }
}
