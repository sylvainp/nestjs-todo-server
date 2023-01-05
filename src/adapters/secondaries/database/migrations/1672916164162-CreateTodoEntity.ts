import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTodoEntity1672916164162 implements MigrationInterface {
  name = 'CreateTodoEntity1672916164162';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "TodoEntity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, CONSTRAINT "PK_de6e2ef92d4a0ca6b479b83b782" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "TodoEntity"`);
  }
}
