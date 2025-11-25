import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Ticket } from "src/entity/ticket.entity";
import { TicketFoto } from "src/entity/ticket_foto.entity";
import { User } from "src/entity/user.entity";
import { Propiedad } from "src/entity/propiedad.entity";
import { CreateTicketDto } from "./ticketDto/create-ticket.dto";

@Injectable()
export class TicketService {

  // ✔ Ticket usando DTO (sin fotos)
  async createTicket(dto: CreateTicketDto) {
    const repo = AppDataSource.getRepository(Ticket);

    const ticket = repo.create({
      descripcion: dto.descripcion,
      prioridad: dto.prioridad,
      estado: dto.estado,
      propiedad: { id: dto.propiedadId },
      usuario: { id: dto.inquilinoId },
      tecnico: dto.tecnico_asignadoId ? { id: dto.tecnico_asignadoId } : null
    });

    await repo.save(ticket);
    return ticket;
  }

  // ✔ Ticket CON fotos
  async crearTicketConFotos(usuarioId: number, data: any, fotos: Express.Multer.File[]) {
    const usuario = await AppDataSource.getRepository(User).findOneBy({ id: usuarioId });
    if (!usuario) throw new Error("Usuario no encontrado");

    const propiedad = await AppDataSource.getRepository(Propiedad).findOneBy({
      id: data.propiedadId
    });
    if (!propiedad) throw new Error("Propiedad no encontrada");

    const ticketRepo = AppDataSource.getRepository(Ticket);
    const ticket = ticketRepo.create({
      descripcion: data.descripcion,
      prioridad: "baja",
      estado: "pendiente",
      usuario: usuario,
      propiedad: propiedad,
      tecnico: null
    });

    await ticketRepo.save(ticket);

    // Guardar fotos
    const repoFoto = AppDataSource.getRepository(TicketFoto);

    for (const archivo of fotos) {
      const foto = repoFoto.create({
        ruta: `/storage/tickets/${archivo.filename}`,
        ticket: ticket
      });
      await repoFoto.save(foto);
    }


    return ticket;
  }

  async getAllTickets() {
  return AppDataSource.getRepository(Ticket).find({
    relations: ["usuario", "propiedad", "tecnico", "fotos"],
    order: { id: "DESC" }
  });
}


  async getTicketsByUsuario(usuarioId: number) {
    return AppDataSource.getRepository(Ticket).find({
      where: { usuario: { id: usuarioId } },
      relations: ["fotos", "propiedad", "tecnico"]
    });
  }

  async cambiarPrioridad(id: number, prioridad: string) {
    await AppDataSource.getRepository(Ticket).update(id, { prioridad });
    return { message: "Prioridad actualizada" };
  }

  async cambiarEstado(id: number, estado: string) {
    await AppDataSource.getRepository(Ticket).update(id, { estado });
    return { message: "Estado actualizado" };
  }

  async asignarTecnico(id: number, tecnicoId: number) {
    const tecnico = await AppDataSource.getRepository(User).findOneBy({ id: tecnicoId });
    if (!tecnico) throw new Error("Técnico no encontrado");

    await AppDataSource.getRepository(Ticket).update(id, { tecnico });
    return { message: "Técnico asignado" };
  }

  
}
