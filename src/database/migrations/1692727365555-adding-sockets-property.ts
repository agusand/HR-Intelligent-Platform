import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingSocketsProperty1692727365555 implements MigrationInterface {
  name = "AddingSocketsProperty1692727365555";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`positions\` ADD \`sockets\` int NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`positions\` DROP COLUMN \`sockets\``);
  }
}
