import { Inject, Injectable, HttpException, HttpStatus } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Ticket } from "src/entity/ticket.entity";
import { TicketFoto } from "src/entity/ticket_foto.entity";
import { User } from "src/entity/user.entity";
import { CreateTicketDto } from "./ticketDto/create-ticket.dto";


@Injectable()
export class TicketService {
    async createTicket(ticketDto: CreateTicketDto)
    {
        const ticket = await AppDataSource.getRepository(Ticket).save({
            descripcion: ticketDto.descripcion,
            prioridad: ticketDto.prioridad,
            estado: ticketDto.estado,
            fecha_limite: ticketDto.fecha_limite,
            propiedad: { id: ticketDto.propiedadId },
            inquilino: { id: ticketDto.inquilinoId },
            tecnico_asignado: { id: ticketDto.tecnico_asignadoId }
        });

        if (ticketDto.UrlFoto && ticketDto.UrlFoto.length > 0) {
            const fotosArray = ticketDto.UrlFoto.map((url: string) => {
                const foto = new TicketFoto();
                foto.ruta_foto = url;
                foto.ticket = ticket; 
                return foto;
                
            });
            await AppDataSource.getRepository(TicketFoto).save(fotosArray);
        }

    for (const foto of fotos) {
      const tFoto = new TicketFoto();
      tFoto.ruta = `/storage/tickets/${foto.filename}`;
      tFoto.ticket = ticket;
      await AppDataSource.getRepository(TicketFoto).save(tFoto);
    }
}

    async getAllTicket()
    {
        return await AppDataSource.getRepository(Ticket).find({
  relations: [
    "propiedad",
    "inquilino",
    "tecnico_asignado",
    "fotos"
  ]
});
    }
    async getTicketById(id:number)
    {
        return await AppDataSource.getRepository(Ticket).findOne({
            where: { id },
            relations: [
                "propiedad",
                "inquilino",
                "tecnico_asignado",
                "fotos"
            ]
        }); 
    }
    async updateTicket(id:number, ticketData : Partial<Ticket>)
    {
        return await AppDataSource.getRepository(Ticket).update(id, ticketData);
        return this.getTicketById(id);
    }
    async deleteTicket(id:number)
    {
        return await AppDataSource.getRepository(Ticket).delete(id);
    }


    async asignarTecnico(ticketId: number, tecnicoId: number) {
        const ticketRepo = AppDataSource.getRepository(Ticket);
        const userRepo = AppDataSource.getRepository(User);

        const tecnico = await userRepo.findOne({ where: { id: tecnicoId } });
        if (!tecnico) {
            throw new HttpException("El técnico no existe.", HttpStatus.NOT_FOUND);
        }

        if (tecnico.rol !== "tecnico") {
            throw new HttpException("El usuario asignado no tiene rol de técnico.", HttpStatus.BAD_REQUEST);
        }

        await ticketRepo.update(ticketId, { tecnico_asignado: { id: tecnicoId } });

        return this.getTicketById(ticketId);
    }


    async actualizarEstado(ticketId: number, estado: string) {
        const estadosPermitidos = ["pendiente", "en_proceso", "resuelto", "cerrado"];
        if (!estadosPermitidos.includes(estado)) {
            throw new HttpException(
                `Estado inválido. Valores permitidos: ${estadosPermitidos.join(", ")}`,
                HttpStatus.BAD_REQUEST
            );
        }

        const ticketRepo = AppDataSource.getRepository(Ticket);
        await ticketRepo.update(ticketId, { estado });

        return this.getTicketById(ticketId);
    }

}
