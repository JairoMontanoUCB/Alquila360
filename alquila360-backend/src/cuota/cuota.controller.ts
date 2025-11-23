import { Controller, Get, Param, Put, Body, Query } from "@nestjs/common";
import { CuotaService } from "./cuota.service";
import { UseGuards, Post, } from '@nestjs/common';
// ¡Asegúrate de importar el DTO de Expensa!
import { CreateExpensaDto } from './cuotaDto/create-expensa.dto'; 
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/cuotas')
@UseGuards(JwtAuthGuard)
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

//  ENDPOINTS DE EXPENSAS 

/**
 * Registra una nueva obligación de expensa en la tabla de Cuotas.
 
 */
  @Post('expensas')
  async registrarExpensa(@Body() createExpensaDto: CreateExpensaDto) {
  // Nota: Asegúrate de que tu servicio maneje la validación del contratoId
    return await this.cuotaService.registrarExpensa(createExpensaDto);
  }

/**
 * Consulta todas las cuotas de tipo 'EXPENSA' para un contrato específico.
 */
  @Get('expensas/contrato/:contratoId')
  async consultarExpensasPorContrato(@Param('contratoId') contratoId: number) {
  // Aseguramos que se envía como número al servicio
    return await this.cuotaService.consultarExpensasPorContrato(Number(contratoId));
  }
}