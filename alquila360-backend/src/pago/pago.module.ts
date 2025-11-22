import { Module } from "@nestjs/common";
import { userInfo } from "os";
import { PagoService } from "./pago.service";
import { PagoController } from "./pago.controller";
import { PdfKitGeneratorService } from "../utils/pdf-generator.service";
import { EmailModule } from "src/email/email.module";


@Module({
    imports: [EmailModule],
    controllers: [PagoController],
    providers: [PagoService, PdfKitGeneratorService],
    exports: [PagoService],
})
export class PagoModule {}
