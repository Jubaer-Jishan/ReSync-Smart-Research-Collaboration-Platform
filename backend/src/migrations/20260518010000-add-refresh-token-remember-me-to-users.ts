import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRefreshTokenRememberMeToUsers20260518010000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('users', 'refreshTokenRememberMe');
    if (!hasColumn) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'refreshTokenRememberMe',
          type: 'boolean',
          isNullable: false,
          default: false,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('users', 'refreshTokenRememberMe');
    if (hasColumn) {
      await queryRunner.dropColumn('users', 'refreshTokenRememberMe');
    }
  }
}