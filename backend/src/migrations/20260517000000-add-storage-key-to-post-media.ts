import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStorageKeyToPostMedia20260517000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'post_media',
      new TableColumn({
        name: 'storageKey',
        type: 'varchar',
        isNullable: false,
        default: "''",
      }),
    );

    await queryRunner.changeColumn(
      'post_media',
      'storageKey',
      new TableColumn({
        name: 'storageKey',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('post_media', 'storageKey');
  }
}
