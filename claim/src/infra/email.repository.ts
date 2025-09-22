// src/infrastructure/repositories/email.repository.impl.ts
import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { IEmailRepository } from '../application/email.repository';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { google } from 'googleapis';

@Injectable()
export class EmailRepositoryImpl implements IEmailRepository, OnModuleInit {
  private transporter: nodemailer.Transporter | null = null;

  async onModuleInit() {
    const CLIENT_ID = process.env.CLIENT_ID!;
    const CLIENT_SECRET = process.env.CLIENT_SECRET!;
    const REDIRECT_URI = process.env.REDIRECT_URI!;
    const REFRESH_TOKEN = process.env.REFRESH_TOKEN!;
    const USER_EMAIL = process.env.SMTP_USER!; // el correo autorizado (ej: tuempresa@gmail.com)

    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN || !USER_EMAIL) {
      throw new Error(
        'Gmail OAuth2 configuration is missing. Please set CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, SMTP_USER',
      );
    }

    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI,
    );

    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    // ✅ Aquí resolvemos el token ANTES de crear el transporter
    const accessTokenObj = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenObj?.token;

    if (!accessToken) {
      throw new Error('No se pudo obtener el access token de Gmail OAuth2');
    }

    this.transporter = nodemailer.createTransport(<SMTPTransport.Options>{
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true para 465, false para 587
      auth: {
        type: 'OAuth2',
        user: USER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken, // ✅ ahora es string, no Promise
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    if (!this.transporter) {
      throw new InternalServerErrorException('Transporter not initialized');
    }

    try {
      await this.transporter.sendMail({
        from: `"Notificaciones" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: body,
      });

      console.log(`✅ Email enviado a ${to} con subject "${subject}"`);
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      throw new InternalServerErrorException('Error enviando email');
    }
  }
}
