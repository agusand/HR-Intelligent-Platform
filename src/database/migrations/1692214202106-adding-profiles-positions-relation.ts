import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingProfilesPositionsRelation1692214202106 implements MigrationInterface {
  name = "AddingProfilesPositionsRelation1692214202106";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`positions_profiles\` (\`profiles\` varchar(50) NOT NULL, \`positions\` int NOT NULL, \`scoring\` int NULL, PRIMARY KEY (\`profiles\`, \`positions\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`positions_profiles\` ADD CONSTRAINT \`FK_31da4b943fdba082e2d1729e09f\` FOREIGN KEY (\`profiles\`) REFERENCES \`profiles\`(\`email\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`positions_profiles\` ADD CONSTRAINT \`FK_ea08cc6bd389dfa00b1d0071b25\` FOREIGN KEY (\`positions\`) REFERENCES \`positions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`positions_profiles\` DROP FOREIGN KEY \`FK_ea08cc6bd389dfa00b1d0071b25\``);
    await queryRunner.query(`ALTER TABLE \`positions_profiles\` DROP FOREIGN KEY \`FK_31da4b943fdba082e2d1729e09f\``);
    await queryRunner.query(`DROP TABLE \`positions_profiles\``);
  }
}
