import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserEntity1673597765045 implements MigrationInterface {
  name = 'AddUserEntity1673597765045';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "UserEntity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "familyName" character varying, "givenName" character varying, "password" character varying NOT NULL, CONSTRAINT "PK_f28c02cf76148cdc220d5c056ed" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "UserEntity"`);
  }
}
