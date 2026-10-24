import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPhotoUrlToWaterReport1741840000000 implements MigrationInterface {
  name = 'AddPhotoUrlToWaterReport1741840000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('WATER_REPORT', [
      new TableColumn({
        name: 'photoUrl',
        type: 'varchar',
        length: '500',
        isNullable: false,
        default: "''",
      }),
      new TableColumn({
        name: 'repairPhotoUrl',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('WATER_REPORT', 'repairPhotoUrl');
    await queryRunner.dropColumn('WATER_REPORT', 'photoUrl');
  }
}
