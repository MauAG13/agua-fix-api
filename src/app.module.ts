import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config/envs';
import { User } from './auth/entities/user.entity';
import { Report } from './reports/entities/report.entity';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: envs.DB_HOST,
        port: envs.DB_PORT,
        username: envs.DB_USERNAME,
        password: envs.DB_PASSWORD,
        database: envs.DB_NAME,
        entities: [User, Report],
        synchronize: false,
        migrationsRun: false,
      }),
    }),
    AuthModule,
    ReportsModule,
    EmailModule,
  ],
})
export class AppModule {}
