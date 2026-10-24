import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  PORT: env.get('PORT').default('3000').asPortNumber(),

  DB_HOST: env.get('DB_HOST').required().asString(),
  DB_PORT: env.get('DB_PORT').default('5432').asPortNumber(),
  DB_USERNAME: env.get('DB_USERNAME').required().asString(),
  DB_PASSWORD: env.get('DB_PASSWORD').required().asString(),
  DB_NAME: env.get('DB_NAME').required().asString(),

  MAIL_HOST: env.get('MAIL_HOST').required().asString(),
  MAIL_PORT: env.get('MAIL_PORT').default('587').asPortNumber(),
  MAIL_USER: env.get('MAIL_USER').required().asString(),
  MAIL_PASS: env.get('MAIL_PASS').required().asString(),
  MAIL_FROM: env.get('MAIL_FROM').default('no-reply@aguafix.gob.mx').asString(),
  MAINTENANCE_EMAIL: env.get('MAINTENANCE_EMAIL').required().asString(),

  AWS_REGION: env.get('AWS_REGION').default('us-east-1').asString(),
  AWS_ACCESS_KEY_ID: env.get('AWS_ACCESS_KEY_ID').required().asString(),
  AWS_SECRET_ACCESS_KEY: env.get('AWS_SECRET_ACCESS_KEY').required().asString(),
  AWS_SESSION_TOKEN: env.get('AWS_SESSION_TOKEN').asString(),
  AWS_BUCKET_NAME: env.get('AWS_BUCKET_NAME').required().asString(),
};
