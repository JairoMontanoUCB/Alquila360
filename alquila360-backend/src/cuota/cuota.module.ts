import { Module } from "@nestjs/common";
import { CuotaService } from "./cuota.service";
import { CuotaController } from "./cuota.controller";

@Module({
 
  controllers: [CuotaController],
  providers: [CuotaService],
  exports: [CuotaService], // Exportar para usar en otros módulos
})
export class CuotaModule {}