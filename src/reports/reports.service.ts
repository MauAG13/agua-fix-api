import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsRepository } from './repositories/reports.repository';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    return this.reportsRepository.create(createReportDto);
  }

  async findAll(): Promise<Report[]> {
    return this.reportsRepository.findAll();
  }
}
