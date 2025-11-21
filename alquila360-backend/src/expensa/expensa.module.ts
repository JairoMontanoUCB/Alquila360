import { Module } from "@nestjs/common"
import { ExpensaService } from "./expensa.service"
import { ExpensaController } from "./expensa.controller"

@Module({
    controllers: [ExpensaController],
    providers: [ExpensaService]
})
export class ExpensaModule{}