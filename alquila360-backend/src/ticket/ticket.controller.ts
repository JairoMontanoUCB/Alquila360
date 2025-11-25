import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles
} from "@nestjs/common";

import { TicketService } from "./ticket.service";
import { CreateTicketDto } from "./ticketDto/create-ticket.dto";

import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import { v4 as uuid } from "uuid";

@Controller("/ticket")
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // ✔ Crear ticket SIN fotos usando DTO
 createTicket(@Body() ticketDto: CreateTicketDto) {
  return this.ticketService.createTicket(ticketDto);
}


  // ✔ Crear ticket CON fotos
  @UseGuards(JwtAuthGuard)
  @Post("/crear")
  @UseInterceptors(
    FilesInterceptor("fotos", 10, {
      storage: diskStorage({
        destination: "./storage/tickets",
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
    return this.ticketService.crearTicketConFotos(req.user.id, body, fotos);
  }

  @UseGuards(JwtAuthGuard)
  @Get("mis-tickets")
  getMisTickets(@Req() req) {
    return this.ticketService.getTicketsByUsuario(req.user.id);
  }
  @UseGuards(JwtAuthGuard)
@Get()
getAllTickets() {
  return this.ticketService.getAllTickets();
}

  @Patch(":id/prioridad")
  cambiarPrioridad(@Param("id") id: number, @Body() body: any) {
    return this.ticketService.cambiarPrioridad(id, body.prioridad);
  }

  @Patch(":id/estado")
  cambiarEstado(@Param("id") id: number, @Body() body: any) {
    return this.ticketService.cambiarEstado(id, body.estado);
  }

  @Patch(":id/asignar")
  asignarTecnico(@Param("id") id: number, @Body() body: any) {
    return this.ticketService.asignarTecnico(id, body.tecnicoId);
  }

  @Get("usuario/:id")
getByUser(@Param("id") id: number) {
  return this.ticketService.getTicketsByUsuario(id);
}
}
