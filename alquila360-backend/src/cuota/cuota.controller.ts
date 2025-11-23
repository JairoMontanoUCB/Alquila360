import { Controller, Get, Param, Put, Body, Query } from "@nestjs/common";
import { CuotaService } from "./cuota.service";

@Controller('/cuotas')
export class CuotaController {
  constructor(private readonly cuotaService: CuotaService) {}

  @Get('/contrato/:contratoId')
  async getCuotasPorContrato(@Param('contratoId') contratoId: number) {
    return await this.cuotaService.obtenerCuotasPorContrato(contratoId);
  }

  @Put('/:cuotaId/estado')
  async actualizarEstadoCuota(
    @Param('cuotaId') cuotaId: number,
    @Body('estado') estado: string,
    @Body('fecha_pago') fechaPago?: Date
  ) {
    return await this.cuotaService.actualizarEstadoCuota(cuotaId, estado, fechaPago);
  }

  @Put('/actualizar-vencidas')
  async actualizarCuotasVencidas() {
    const cantidad = await this.cuotaService.actualizarCuotasVencidas();
    return { 
      message: `Se actualizaron ${cantidad} cuotas vencidas`,
      cuotasActualizadas: cantidad 
    };
  }
}