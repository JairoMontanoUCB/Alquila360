import { Injectable } from '@nestjs/common';
import AppDataSource from 'src/data-source';
import { Ticket } from 'src/entity/ticket.entity';
import { TicketFoto } from 'src/entity/ticket_foto.entity';
import { User } from 'src/entity/user.entity';
import { Propiedad } from 'src/entity/propiedad.entity';
import { CreateTicketDto } from './ticketDto/create-ticket.dto';

@Injectable()
export class TicketService {

  async crearTicket(
  inquilinoId: number,
  data: CreateTicketDto,
  fotos: Express.Multer.File[]
) {
  const usuario = await AppDataSource.getRepository(User).findOneBy({ id: inquilinoId });
  if (!usuario) throw new Error("Usuario no encontrado");

  const propiedad = await AppDataSource.getRepository(Propiedad).findOneBy({ id: data.propiedadId });
  if (!propiedad) throw new Error("Propiedad no encontrada");

  // Crear ticket con valores por defecto
  const ticket = new Ticket();
  ticket.descripcion = data.descripcion;
  ticket.usuario = usuario;          // inquilino creador
  ticket.propiedad = propiedad;
  ticket.prioridad = "baja";
  ticket.estado = "pendiente";
  ticket.tecnico = null;

  await AppDataSource.getRepository(Ticket).save(ticket);

  // Guardar fotos si existen
  if (fotos && fotos.length > 0) {
    for (const foto of fotos) {
      const tFoto = new TicketFoto();
      tFoto.ruta = `/storage/tickets/${foto.filename}`;
      tFoto.ticket = ticket;
      await AppDataSource.getRepository(TicketFoto).save(tFoto);
    }
  }

  return {
    message: "Ticket creado correctamente",
    id: ticket.id
  };
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
