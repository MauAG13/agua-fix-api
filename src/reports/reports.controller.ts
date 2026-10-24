import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { EmailService } from '../email/email.service';
import { StorageService } from '../storage/storage.service';
import { generateReportTemplate } from './templates/report.template';
import { envs } from '../config/envs';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly emailService: EmailService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() createReportDto: CreateReportDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    if (!photo) {
      throw new BadRequestException(
        'La fotografía de la fuga (campo "photo") es obligatoria',
      );
    }

    const photoUrl = await this.storageService.uploadFile(photo, 'reports');

    const report = await this.reportsService.create({
      ...createReportDto,
      photoUrl,
    });

    const emailHtml = generateReportTemplate(createReportDto, photoUrl);
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
