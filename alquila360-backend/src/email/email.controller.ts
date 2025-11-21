import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test-welcome')
  async testWelcome(@Body() body: { email: string; nombre: string }) {
    return this.emailService.sendWelcomeEmail(body.email, body.nombre);
  }

  @Post('test-payment')
  async testPayment(
    @Body()
    body: { email: string; monto: number; fecha: string }
  ) {
    return this.emailService.sendPaymentEmail(
      body.email,
      body.monto,
      body.fecha
    );
  }
}
