// src/infrastructure/repositories/email.repository.impl.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IEmailRepository } from '../application/email.repository';
import axios from 'axios';
import * as qs from 'querystring';

@Injectable()
export class EmailRepositoryImpl implements IEmailRepository {
  private clientId = process.env.CLIENT_ID!;
  private clientSecret = process.env.CLIENT_SECRET!;
  private refreshToken = process.env.REFRESH_TOKEN!;
  private userEmail = process.env.SMTP_USER!; // tu correo autorizado

  // 🔑 Paso 1: obtener accessToken desde refreshToken (sin googleapis)
  private async getAccessToken(): Promise<string> {
    const url = 'https://oauth2.googleapis.com/token';

    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token',
    };

    try {
      const res = await axios.post(url, qs.stringify(body), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      return res.data.access_token;
    } catch (err) {
      console.error('❌ Error obteniendo access token:', err.response?.data || err.message);
      throw new InternalServerErrorException('No se pudo obtener access token');
    }
  }

  // 📧 Paso 2: crear correo MIME (RFC 2822) y codificarlo en base64url
  private buildRawMessage(to: string, subject: string, body: string): string {
    const message = [
      `From: ${this.userEmail}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=UTF-8',
      '',
      body,
    ].join('\n');

    // base64url (sin padding =, sin +, sin /)
    return Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // 🚀 Paso 3: enviar correo a la API de Gmail
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    const accessToken = await this.getAccessToken();
    const raw = this.buildRawMessage(to, subject, body);

    try {
      await axios.post(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        { raw },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      console.log(`✅ Email enviado a ${to} con subject "${subject}"`);
    } catch (err) {
      console.error('❌ Error enviando email:', err.response?.data || err.message);
      throw new InternalServerErrorException('Error enviando email');
    }
  }
}
