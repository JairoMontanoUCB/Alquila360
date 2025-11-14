import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { PagoModule } from '../pago/pago.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PagoModule, UserModule],
  providers: [PdfService],
  controllers: [PdfController]
})
export class PdfModule {}
