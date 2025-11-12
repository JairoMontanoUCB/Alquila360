import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PropiedadModule } from  './propiedad/propiedad.module'
import { ContratoModule } from './contrato/contrato.module';
import { TicketModule } from './ticket/ticket.module';
import { PagoModule } from './pago/pago.module';


@Module({
  imports: [UserModule,PropiedadModule,ContratoModule,TicketModule,PagoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
