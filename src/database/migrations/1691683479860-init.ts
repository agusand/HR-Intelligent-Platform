import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1691683479860 implements MigrationInterface {
  name = "Init1691683479860";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`questions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`question\` varchar(2000) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`answers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`questionId\` int NOT NULL, \`answer\` varchar(2000) NOT NULL, \`profile\` varchar(50) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`profiles\` (\`email\` varchar(50) NOT NULL, \`first_name\` varchar(50) NOT NULL, \`last_name\` varchar(50) NOT NULL, PRIMARY KEY (\`email\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_89fee9dd5a225cd521a46beba34\` FOREIGN KEY (\`profile\`) REFERENCES \`profiles\`(\`email\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_question-id-answers\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_question-id-answers\``);
    await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_89fee9dd5a225cd521a46beba34\``);
    await queryRunner.query(`DROP TABLE \`profiles\``);
    await queryRunner.query(`DROP TABLE \`answers\``);
    await queryRunner.query(`DROP TABLE \`questions\``);
  }
}
