import { Injectable, Logger } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Cuota } from "src/entity/cuota.entity";
import { Contrato } from "src/entity/contrato.entity";

@Injectable()
export class CuotaService {
  private readonly logger = new Logger(CuotaService.name);

  /**
   * Genera todas las cuotas mensuales para un contrato
   * @param contrato - Contrato para el cual generar las cuotas
   */
  async generarCuotasMensuales(contrato: Contrato): Promise<Cuota[]> {
    try {
      this.logger.log(`Generando cuotas para contrato ID: ${contrato.id}`);
      
      const cuotas: Cuota[] = [];
      const fechaInicio = new Date(contrato.fecha_inicio);
      const fechaFin = new Date(contrato.fecha_fin);
      
      // Calcular número total de meses del contrato
      const totalMeses = this.calcularTotalMeses(fechaInicio, fechaFin);
      
      this.logger.log(`Duración del contrato: ${totalMeses} meses`);

      // Generar una cuota por cada mes
      for (let i = 0; i < totalMeses; i++) {
        const cuota = new Cuota();
        cuota.contrato = contrato;
        cuota.contrato_id = contrato.id;
        cuota.numero_referencia = this.generarNumeroReferencia(contrato.id, i + 1);
        cuota.fecha_vencimiento = this.calcularFechaVencimiento(fechaInicio, i);
        cuota.monto = contrato.monto_mensual;
        cuota.estado = "pendiente";

        cuotas.push(cuota);
      }

      // Guardar todas las cuotas en la base de datos
      const cuotasGuardadas = await AppDataSource.getRepository(Cuota).save(cuotas);
      
      this.logger.log(`Se generaron ${cuotasGuardadas.length} cuotas para contrato ID: ${contrato.id}`);
      
      return cuotasGuardadas;
    } catch (error) {
      this.logger.error(`Error generando cuotas para contrato ${contrato.id}:`, error);
      throw error;
    }
  }

  /**
   * Calcula el total de meses entre dos fechas
   */
  private calcularTotalMeses(fechaInicio: Date, fechaFin: Date): number {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    let meses = (fin.getFullYear() - inicio.getFullYear()) * 12;
    meses -= inicio.getMonth();
    meses += fin.getMonth();
    
    return meses <= 0 ? 1 : meses; // Mínimo 1 mes
  }

  /**
   * Genera un número de referencia único para la cuota
   * Formato: C{contratoId}-M{mes}
   */
  private generarNumeroReferencia(contratoId: number, mes: number): string {
    return `C${contratoId.toString().padStart(6, '0')}-M${mes.toString().padStart(2, '0')}`;
  }

  /**
   * Calcula la fecha de vencimiento para una cuota específica
   * Las cuotas vencen el día 10 de cada mes
   */
  private calcularFechaVencimiento(fechaInicio: Date, mesOffset: number): Date {
    const fechaVencimiento = new Date(fechaInicio);
    
    // Avanzar el número de meses correspondiente
    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + mesOffset);
    
    // Establecer el día de vencimiento (ej: día 10 de cada mes)
    fechaVencimiento.setDate(10);
    
    return fechaVencimiento;
  }

  /**
   * Obtiene todas las cuotas de un contrato
   */
  async obtenerCuotasPorContrato(contratoId: number): Promise<Cuota[]> {
    return await AppDataSource.getRepository(Cuota).find({
      where: { contrato_id: contratoId },
      order: { fecha_vencimiento: 'ASC' }
    });
  }

  /**
   * Actualiza el estado de una cuota
   */
  async actualizarEstadoCuota(cuotaId: number, estado: string, fechaPago?: Date): Promise<Cuota> {
    const cuotaRepository = AppDataSource.getRepository(Cuota);
    
    const cuota = await cuotaRepository.findOneBy({ id: cuotaId });
    if (!cuota) {
      throw new Error(`Cuota con ID ${cuotaId} no encontrada`);
    }

    cuota.estado = estado;
    if (fechaPago && estado === 'pagada') {
      cuota.fecha_pago = fechaPago;
    }

    return await cuotaRepository.save(cuota);
  }

  /**
   * Verifica y actualiza cuotas vencidas automáticamente
   */
  async actualizarCuotasVencidas(): Promise<number> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a inicio del día

    const cuotaRepository = AppDataSource.getRepository(Cuota);
    
    const cuotasVencidas = await cuotaRepository
      .createQueryBuilder('cuota')
      .where('cuota.estado = :estado', { estado: 'pendiente' })
      .andWhere('cuota.fecha_vencimiento < :hoy', { hoy })
      .getMany();

    if (cuotasVencidas.length > 0) {
      for (const cuota of cuotasVencidas) {
        cuota.estado = 'vencida';
      }
      await cuotaRepository.save(cuotasVencidas);
      
      this.logger.log(`Se actualizaron ${cuotasVencidas.length} cuotas a estado 'vencida'`);
    }

    return cuotasVencidas.length;
  }
}