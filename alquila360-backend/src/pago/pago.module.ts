import { Module } from "@nestjs/common";
import { userInfo } from "os";
import { PagoService } from "./pago.service";
import { PagoController } from "./pago.controller";
import { PdfGeneratorService } from "src/utils/pdf-generator.service";

@Module({
    imports: [],
    controllers: [PagoController],
    providers: [PagoService, PdfGeneratorService],
    exports: [PagoService],
})
export class PagoModule {}
