import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { Ticket } from "src/entity/ticket.entity";
import { get } from "http";
import { CreateTicketDto } from "./ticketDto/create-ticket.dto";

@Controller('/ticket')
export class TicketController {
    constructor(private readonly ticketService : TicketService) {
    }
    
    @Post()
    createTicket(@Body() ticketDto : CreateTicketDto) {
        return this.ticketService.createTicket(ticketDto);
    }

    @Get()
    getAllTicket() {
        return this.ticketService.getAllTicket();
    }
    @Get('/:id')
    getTicketById(@Param()param: any) {
        return this.ticketService.getTicketById(param.id);
    }
    @Put('/:id')
    updateTicket(@Param()param: any, @Body() ticket: Ticket) {
        return this.ticketService.updateTicket(param.id, ticket);
    }
    @Delete('/:id')
    deleteTicket(@Param()param: any) {
        return this.ticketService.deleteTicket(param.id);
    }

    @Put('/:id/asignar-tecnico')
    asignarTecnico(
        @Param('id') id: number,
        @Body('tecnicoId') tecnicoId: number
    ) {
        return this.ticketService.asignarTecnico(id, tecnicoId);
    }
    @Put('/:id/estado')
    actualizarEstado(
        @Param('id') id: number,
        @Body('estado') estado: string
    ) {
        return this.ticketService.actualizarEstado(id, estado);
    }

}


