import { Inject, Injectable, HttpException, HttpStatus } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Ticket } from "src/entity/ticket.entity";
import { TicketFoto } from "src/entity/ticket_foto.entity";
import { User } from "src/entity/user.entity";

@Injectable()
export class TicketService {
    async createTicket(data: any)
    {
        const ticket = await AppDataSource.getRepository(Ticket).save({
            descripcion: data.descripcion,
            prioridad: data.prioridad,
            estado: data.estado,
            fecha_limite: data.fecha_limite,
            propiedad: { id: data.propiedadId },
            contrato: { id: data.contratoId },
            inquilino: { id: data.inquilinoId },
            tecnico_asignado: { id: data.tecnicoAsignadoId }
        });

        
        if (data.fotos && data.fotos.length > 0) {

            const fotoRepo = AppDataSource.getRepository(TicketFoto);

            const fotosAInsertar = data.fotos.map((ruta: string) => ({
                ruta_foto: ruta,
                ticket: ticket
            }));

            await fotoRepo.save(fotosAInsertar);
        }

        return ticket;
    }

    async getAllTicket()
    {
        return await AppDataSource.getRepository(Ticket).find({
  relations: [
    "propiedad",
    "contrato",
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
                "contrato",
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