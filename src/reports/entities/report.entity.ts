import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'WATER_REPORT' })
export class Report {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  severity: string;

  @Column({ type: 'varchar', length: 50 })
  reporterPhone: string;

  @Column({ type: 'varchar', length: 500 })
  photoUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  repairPhotoUrl: string | null;

  @Column({ type: 'boolean', default: false })
  isResolved: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
