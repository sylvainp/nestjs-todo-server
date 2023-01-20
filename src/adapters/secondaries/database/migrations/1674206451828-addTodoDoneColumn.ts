import { MigrationInterface, QueryRunner } from "typeorm";

export class addTodoDoneColumn1674206451828 implements MigrationInterface {
    name = 'addTodoDoneColumn1674206451828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TodoEntity" ADD "done" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TodoEntity" DROP COLUMN "done"`);
    }

}
