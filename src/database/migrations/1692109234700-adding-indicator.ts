import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingIndicator1692109234700 implements MigrationInterface {
  name = "AddingIndicator1692109234700";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`indicators\` (\`indicator\` varchar(2000) NOT NULL, \`profile\` varchar(50) NOT NULL, \`value\` int NOT NULL, PRIMARY KEY (\`indicator\`, \`profile\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`indicators\` ADD CONSTRAINT \`FK_38b542071dcfa0c975f9c9f45f9\` FOREIGN KEY (\`profile\`) REFERENCES \`profiles\`(\`email\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`indicators\` DROP FOREIGN KEY \`FK_38b542071dcfa0c975f9c9f45f9\``);
    await queryRunner.query(`DROP TABLE \`indicators\``);
  }
}
