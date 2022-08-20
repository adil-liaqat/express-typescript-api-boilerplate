
import { Op } from 'sequelize';
export {};

declare global {
  interface Console {
    silly: (message?: any, ...optionalParams: any[]) => void;
  }
  namespace NodeJS {
    interface Global {
      baseUrl: string,
      Op: typeof Op
    }

    interface ProcessEnv {
      NODE_ENV: 'development' | 'staging' | 'production',
      PORT: string,
      DB_DATABASE: string,
      DB_HOST: string,
      DB_PORT: string,
      DB_USER: string,
      DB_PASSWORD: string,
      MAIL_SMTP_HOST: string,
      MAIL_SMTP_PORT: string,
      MAIL_SMTP_SECURE: string,
      MAIL_SMTP_USER: string,
      MAIL_SMTP_PASSWORD: string,
      MAIL_FROM: string,
      JWT_SECRET: string,
    }
  }
}
