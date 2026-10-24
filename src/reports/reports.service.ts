import { Injectable } from '@nestjs/common';
import { ReportsRepository } from './repositories/reports.repository';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async create(reportData: Partial<Report>): Promise<Report> {
    return this.reportsRepository.create(reportData);
  }

  async findAll(): Promise<Report[]> {
    return this.reportsRepository.findAll();
  }
}
