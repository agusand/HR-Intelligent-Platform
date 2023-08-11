import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1691702703211 implements MigrationInterface {
  name = "InitTables1691702703211";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`profiles\` (\`email\` varchar(50) NOT NULL, \`first_name\` varchar(50) NOT NULL, \`last_name\` varchar(50) NOT NULL, \`is_external\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`email\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`questions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`question\` varchar(2000) NOT NULL, \`cryteria\` varchar(2000) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`answers\` (\`questionId\` int NOT NULL, \`answer\` varchar(2000) NOT NULL, \`profile\` varchar(50) NOT NULL, PRIMARY KEY (\`questionId\`, \`profile\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_c38697a57844f52584abdb878d7\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_89fee9dd5a225cd521a46beba34\` FOREIGN KEY (\`profile\`) REFERENCES \`profiles\`(\`email\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_89fee9dd5a225cd521a46beba34\``);
    await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_c38697a57844f52584abdb878d7\``);
    await queryRunner.query(`DROP TABLE \`answers\``);
    await queryRunner.query(`DROP TABLE \`questions\``);
    await queryRunner.query(`DROP TABLE \`profiles\``);
  }
}
