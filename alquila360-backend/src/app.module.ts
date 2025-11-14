import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PropiedadModule } from  './propiedad/propiedad.module'
import { ContratoModule } from './contrato/contrato.module';
import { TicketModule } from './ticket/ticket.module';
import { PagoModule } from './pago/pago.module';
import { PdfModule } from './pdf/pdf.module';
import { authPlugins } from 'mysql2';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [UserModule,PropiedadModule,ContratoModule,TicketModule,PagoModule,PdfModule,AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
