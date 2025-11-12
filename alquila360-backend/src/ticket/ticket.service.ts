import { Inject, Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Ticket } from "src/entity/ticket.entity";

@Injectable()
export class TicketService {
    async createTicket(ticket:Ticket)
    {
        return await AppDataSource.getRepository(Ticket).save(ticket);
    }

    async getAllTicket()
    {
        return await AppDataSource.getRepository(Ticket).find();
    }
    async getTicketById(id:number)
    {
        return await AppDataSource.getRepository(Ticket).findOneBy({id}); 
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

}