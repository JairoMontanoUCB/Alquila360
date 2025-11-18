import { Module } from "@nestjs/common";
import { userInfo } from "os";
import { PagoService } from "./pago.service";
import { PagoController } from "./pago.controller";
import { PdfKitGeneratorService } from "../utils/pdf-generator.service";


@Module({
    imports: [],
    controllers: [PagoController],
    providers: [PagoService, PdfKitGeneratorService],
    exports: [PagoService],
})
export class PagoModule {}
