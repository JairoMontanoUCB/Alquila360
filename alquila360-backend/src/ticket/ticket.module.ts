import { Module } from "@nestjs/common";
import { userInfo } from "os";
import { TicketService } from "./ticket.service";
import { TicketController } from "./ticket.controller";

@Module({
    imports: [],
    controllers: [TicketController],
    providers: [TicketService],
})
export class ContratoModule {}
