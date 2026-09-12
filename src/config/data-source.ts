import { DataSource } from 'typeorm';
import { envs } from './envs';
import { User } from '../auth/entities/user.entity';
import { Report } from '../reports/entities/report.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USERNAME,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  synchronize: false,
  entities: [User, Report],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
});
