import { Module } from "@nestjs/common";
import { ContratoService } from "./contrato.service";
import { ContratoController } from "./contrato.controller";
import { PdfModule } from "src/utils/pdf-generator.module";

@Module({
    imports: [PdfModule],
    controllers: [ContratoController],
    providers: [ContratoService],
})
export class ContratoModule {}
