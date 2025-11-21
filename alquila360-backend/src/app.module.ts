import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PropiedadModule } from  './propiedad/propiedad.module'
import { ContratoModule } from './contrato/contrato.module';
import { TicketModule } from './ticket/ticket.module';
import { PagoModule } from './pago/pago.module';
import { authPlugins } from 'mysql2';
import { AuthModule } from './auth/auth.module';
import { ExpensaModule } from './expensa/expensa.module';

@Module({
<<<<<<< HEAD
  imports: [UserModule,PropiedadModule,ContratoModule,TicketModule,PagoModule,AuthModule,ExpensaModule],
=======
imports: [
  UserModule,
  PropiedadModule,
  ContratoModule,
  TicketModule,
  PagoModule,
  AuthModule
],
>>>>>>> origin/ticketPrueba
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

