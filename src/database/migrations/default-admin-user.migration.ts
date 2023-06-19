import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

const defaultAdministratorId = '53231f78-13d6-11ed-861d-0242ac120002';

export class DefaultAdministratorUserMigration1686566874682 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();

    try {
      const res = await queryRunner.query(
        `SELECT id FROM users WHERE id='${defaultAdministratorId}';`,
      );
      if (res[0]?.length) {
        return;
      }

      const moderatorRoleRes = await queryRunner.query(
        "SELECT id FROM roles WHERE value='ADMINISTRATOR';",
      );
      const moderatorRoleId = moderatorRoleRes.pop()['id'];
      if (!moderatorRoleId) {
        const msg = 'firstly init user roles';
        throw new Error(msg);
      }

      const hashPassword = await bcrypt.hash('password', 5);
      await queryRunner.query(
        'INSERT INTO users (id, email, password, "roleId") \n' +
          `VALUES ('${defaultAdministratorId}', 'administrator@local.com', '${hashPassword}', '${moderatorRoleId}');`,
      );
      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(`Error: ${e.message}`);
      await queryRunner.rollbackTransaction();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM users WHERE id='${defaultAdministratorId}';`);
  }
}
