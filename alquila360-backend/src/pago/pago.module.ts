import { Module } from "@nestjs/common";
import { userInfo } from "os";
import { PagoService } from "./pago.service";
import { PagoController } from "./pago.controller";

@Module({
    imports: [],
    controllers: [PagoController],
    providers: [PagoService],
})
export class PagoModule {}
