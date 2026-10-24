import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { envs } from '../config/envs';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;

  constructor() {
    const credentials: {
      accessKeyId: string;
      secretAccessKey: string;
      sessionToken?: string;
    } = {
      accessKeyId: envs.AWS_ACCESS_KEY_ID,
      secretAccessKey: envs.AWS_SECRET_ACCESS_KEY,
    };

    if (envs.AWS_SESSION_TOKEN) {
      credentials.sessionToken = envs.AWS_SESSION_TOKEN;
    }

    this.s3Client = new S3Client({
      region: envs.AWS_REGION,
      credentials,
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    const uniqueSuffix = `${Date.now()}-${randomUUID()}`;
    const sanitizedFilename = file.originalname ? file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_') : 'photo.jpg';
    const key = `${cleanFolder}/${uniqueSuffix}-${sanitizedFilename}`;

    const command = new PutObjectCommand({
      Bucket: envs.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    const publicUrl = `https://${envs.AWS_BUCKET_NAME}.s3.${envs.AWS_REGION}.amazonaws.com/${key}`;
    this.logger.log(`Archivo subido exitosamente a S3: ${publicUrl}`);
    return publicUrl;
  }
}
