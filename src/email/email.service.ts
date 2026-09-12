import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from '../config/envs';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: envs.MAIL_HOST,
      port: envs.MAIL_PORT,
      secure: envs.MAIL_PORT === 465,
      auth: {
        user: envs.MAIL_USER,
        pass: envs.MAIL_PASS,
      },
    });
  }

  async onModuleInit() {
    if (envs.MAIL_USER === 'ethereal_user') {
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        this.logger.log(`Cuenta de prueba Ethereal inicializada automáticamente: ${testAccount.user}`);
      } catch (err) {
        this.logger.warn('No se pudo generar cuenta Ethereal automática, usando configuración de envs');
      }
    }
  }

  async sendEmail(to: string, subject: string, template: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: envs.MAIL_FROM,
        to,
        subject,
        html: template,
      });
      this.logger.log(`Correo enviado con éxito a ${to} - ID: ${info.messageId}`);
      
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.log(`👉 Vista previa del correo HTML: ${previewUrl}`);
      }
    } catch (error) {
      this.logger.error(`Error al enviar correo a ${to}: ${error.message}`);
    }
  }
}
