import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { EmailService } from '../email/email.service';
import { generateReportTemplate } from './templates/report.template';
import { envs } from '../config/envs';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  async create(@Body() createReportDto: CreateReportDto) {
    const report = await this.reportsService.create(createReportDto);

    const emailHtml = generateReportTemplate(createReportDto);
    await this.emailService.sendEmail(
      envs.MAINTENANCE_EMAIL,
      `Alerta de Fuga de Agua - Reporte #${report.id} [${report.severity.toUpperCase()}]`,
      emailHtml,
    );

    return report;
  }

  @Get()
  async findAll() {
    return this.reportsService.findAll();
  }
}
