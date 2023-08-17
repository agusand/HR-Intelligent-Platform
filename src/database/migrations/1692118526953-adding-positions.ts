import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingPositions1692118526953 implements MigrationInterface {
  name = "AddingPositions1692118526953";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`positions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`questions\` ADD \`position\` int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`questions\` ADD CONSTRAINT \`FK_e9a77375e92a8e6eab1296400a8\` FOREIGN KEY (\`position\`) REFERENCES \`positions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_e9a77375e92a8e6eab1296400a8\``);
    await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`position\``);
    await queryRunner.query(`DROP TABLE \`positions\``);
  }
}
