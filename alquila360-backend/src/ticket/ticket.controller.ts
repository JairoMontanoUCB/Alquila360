import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { Ticket } from "src/entity/ticket.entity";
import { get } from "http";
import { CreateTicketDto } from "./ticketDto/create-ticket.dto";

import { CreateTicketDto } from './ticketDto/create-ticket.dto';

@Controller('/ticket')
export class TicketController {
    constructor(private readonly ticketService : TicketService) {
    }
    
    @Post()
    createTicket(@Body() ticketDto : CreateTicketDto) {
        return this.ticketService.createTicket(ticketDto);
    }

  @UseGuards(JwtAuthGuard)
  @Post('/crear')
  @UseInterceptors(
    FilesInterceptor('fotos', 10, {
      storage: diskStorage({
        destination: './storage/tickets',
        filename: (req, file, cb) => {
          const filename = uuid() + path.extname(file.originalname);
          cb(null, filename);
        }
      })
    })
  )
  crear(
    @Req() req,
    @Body() body: CreateTicketDto,
    @UploadedFiles() fotos: Express.Multer.File[]
  ) {
    return this.ticketService.crearTicket(req.user.id, body, fotos);
  }

  @UseGuards(JwtAuthGuard)
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
