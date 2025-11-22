import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'alquila360.app@gmail.com', //HAY QUE CREAR CORREO PARA LA APP
        pass: 'eeqv oxrs iisa yzgo',    //https://myaccount.google.com/apppasswords
      },
    });
  }

  private loadTemplate(templateName: string): string {
    const templatePath = path.join(__dirname, 'templates', templateName);
    return fs.readFileSync(templatePath, 'utf-8');
  }

  async sendWelcomeEmail(to: string, nombre: string) {
    let html = this.loadTemplate('welcome.html');
    html = html.replace('{{nombre}}', nombre);

    return this.transporter.sendMail({
      from: '"Alquila360" <TU_CORREO@gmail.com>',
      to,
      subject: 'Bienvenido a Alquila360',
      html,
    });
  }

  async sendPaymentEmail(to: string, monto: number, fecha: string) {
    let html = this.loadTemplate('payment.html');
    html = html.replace('{{monto}}', monto.toString());
    html = html.replace('{{fecha}}', fecha);

    return this.transporter.sendMail({
      from: '"Alquila360" <TU_CORREO@gmail.com>',
      to,
      subject: 'Pago realizado con éxito',
      html,
    });
  }
}
