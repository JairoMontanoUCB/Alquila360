import { Module } from "@nestjs/common";
import { ContratoService } from "./contrato.service";
import { ContratoController } from "./contrato.controller";
import { PdfModule } from "src/utils/pdf-generator.module";
import { CuotaModule } from "src/cuota/cuota.module";

@Module({
    imports: [PdfModule, CuotaModule],
    controllers: [ContratoController],
    providers: [ContratoService],
})
export class ContratoModule {}