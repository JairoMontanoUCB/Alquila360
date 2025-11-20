import {
  Controller,
  Post,
  Patch,
  Get,
  Req,
  Body,
  Param,
  UseGuards,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';

import { TicketService } from './ticket.service';
//import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Controller('/ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  //@UseGuards(JwtAuthGuard)
  @Post('/crear')
  @UseInterceptors(
    FilesInterceptor('fotos', 10, {
      storage: diskStorage({
        destination: './storage/tickets',
        filename: (req, file, cb) => {
          const name = uuid() + path.extname(file.originalname);
          cb(null, name);
        }
      })
    })
  )
  crear(
    @Req() req,
    @Body() body: any,
    @UploadedFiles() fotos: Express.Multer.File[]
  ) {
    return this.ticketService.crearTicket(req.user.id, body, fotos);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('mis-tickets')
  getMisTickets(@Req() req) {
    return this.ticketService.getTicketsByUsuario(req.user.id);
  }

  @Patch(':id/prioridad')
  cambiarPrioridad(@Param('id') id: number, @Body() body: any) {
    return this.ticketService.cambiarPrioridad(id, body.prioridad);
  }

  @Patch(':id/estado')
  cambiarEstado(@Param('id') id: number, @Body() body: any) {
    return this.ticketService.cambiarEstado(id, body.estado);
  }

  @Patch(':id/asignar')
  asignarTecnico(@Param('id') id: number, @Body() body: any) {
    return this.ticketService.asignarTecnico(id, body.tecnicoId);
  }
}
