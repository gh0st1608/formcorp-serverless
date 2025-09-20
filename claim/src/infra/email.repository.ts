// src/infrastructure/repositories/email.repository.impl.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IEmailRepository } from '../application/email.repository';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailRepositoryImpl implements IEmailRepository {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configuración usando variables de entorno
    const host = process.env.SMTP_HOST || 'smtp.secureserver.net'; //// o smtp.office365.com
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
      throw new Error(
        'SMTP configuration is missing. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS',
      );
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true para 465, false para otros
      auth: {
        user,
        pass,
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || `"No Reply" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text: body,
      });

      console.log(`Email enviado a ${to} con subject "${subject}"`);
    } catch (error) {
      console.error('Error enviando email:', error);
      throw new InternalServerErrorException('Error enviando email');
    }
  }
}
