import { BusinessException, UsuarioNoActivoException } from '../Exceptions/BussinessException'; 
import AppDataSource from "src/data-source";
import { User } from "src/entity/user.entity";
import { Ticket } from "src/entity/ticket.entity";

// --- Clases de Excepción Específicas para Tickets (Asegúrate de definirlas) ---
class TicketNoEncontradoException extends BusinessException {
    constructor(ticketId: number) {
        super(`Ticket con ID ${ticketId} no encontrado.`);
    }
}

class TecnicoNoEncontradoException extends BusinessException {
    constructor(tecnicoId: number) {
        super(`Técnico con ID ${tecnicoId} no encontrado.`);
    }
}

class UsuarioNoEsTecnicoException extends BusinessException {
    constructor(userId: number, rol: string) {
        super(`El usuario ID ${userId} no es un técnico, su rol es ${rol}.`);
    }
}

class TicketNoAsignableException extends BusinessException {
    constructor(ticketId: number, estado: string) {
        super(`El ticket ID ${ticketId} no puede ser asignado o reasignado porque ya está en estado '${estado}'.`);
    }
}

class TicketNoActualizableException extends BusinessException {
    constructor(ticketId: number, estado: string) {
        super(`El ticket ID ${ticketId} no puede actualizar su avance porque está en estado '${estado}'.`);
    }
}

// -----------------------------------------------------------------------------

export class TicketRules {
    
    /**
     * Valida la existencia del ticket y lo retorna.
     */
    static async validarExistenciaTicket(ticketId: number): Promise<Ticket> {
        // NOTA: Si ya migraste a la inyección de repositorio, reemplaza AppDataSource
        const ticket = await AppDataSource.getRepository(Ticket).findOne({ 
            where: { id: ticketId } 
        });
        
        if (!ticket) {
            throw new TicketNoEncontradoException(ticketId);
        }
        return ticket;
    }

    /**
     * Valida que el técnico exista, esté activo y tenga el rol de 'tecnico'.
     */
    static async validarTecnico(tecnicoId: number): Promise<User> {
        const tecnico = await AppDataSource.getRepository(User).findOneBy({ id: tecnicoId });
        
        if (!tecnico) {
            throw new TecnicoNoEncontradoException(tecnicoId);
        }
        
        if (tecnico.estado !== 'activo') {
            throw new UsuarioNoActivoException(tecnicoId, tecnico.estado);
        }
        
        if (tecnico.rol !== 'tecnico') {
            throw new UsuarioNoEsTecnicoException(tecnicoId, tecnico.rol);
        }
        
        return tecnico;
    }

    /**
     * Valida si el ticket puede ser asignado (o reasignado).
     * Solo se puede asignar si está 'pendiente' o ya está en 'proceso'.
     */
    static validarTicketParaAsignacion(ticket: Ticket): void {
        const estadoPermitido = ['pendiente', 'proceso'];
        if (!estadoPermitido.includes(ticket.estado)) {
            throw new TicketNoAsignableException(ticket.id, ticket.estado);
        }
    }

    /**
     * Valida si el ticket puede actualizar su avance (solo si está 'en proceso').
     * Si está 'resuelto', no se puede actualizar el avance.
     */
    static validarTicketParaActualizacionAvance(ticket: Ticket, nuevoEstado: string): void {
        if (ticket.estado === 'resuelto') {
             throw new TicketNoActualizableException(ticket.id, ticket.estado);
        }

        // Si el ticket está 'pendiente' y el nuevo estado no es 'proceso', lanzar error.
        // Si el ticket está 'proceso', cualquier cambio a 'proceso' o 'resuelto' es válido.
        if (ticket.estado === 'pendiente' && nuevoEstado !== 'proceso') {
             throw new BusinessException('El estado de un ticket pendiente solo puede cambiar a "proceso" o ser asignado.');
        }

        // Si un ticket ya está en proceso y se quiere resolver, debe tener un técnico asignado.
        if (nuevoEstado === 'resuelto' && !ticket.tecnico) {
             throw new BusinessException('Un ticket no puede ser marcado como "resuelto" si no tiene un técnico asignado.');
        }
    }

    /**
     * Valida que el nuevo estado sea uno de los valores permitidos en el enum.
     */
    static validarEstadoValido(estado: string): void {
        const estadosPermitidos = ["pendiente", "proceso", "resuelto"];
        if (!estadosPermitidos.includes(estado)) {
            throw new BusinessException(`El estado '${estado}' no es un valor válido. Debe ser uno de: ${estadosPermitidos.join(', ')}`);
        }
    }
}