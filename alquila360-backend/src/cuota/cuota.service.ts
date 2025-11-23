import { Injectable, Logger } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Cuota } from "src/entity/cuota.entity";
import { Contrato } from "src/entity/contrato.entity";
import { CreateExpensaDto } from "./cuotaDto/create-expensa.dto";

@Injectable()
export class CuotaService {
  private readonly logger = new Logger(CuotaService.name);

  /**
   * Genera todas las cuotas mensuales para un contrato, No se divide el monto porque ya es mensual
   */
  async generarCuotasMensuales(contrato: Contrato): Promise<Cuota[]> {
    try {
      this.logger.log(`Generando cuotas para contrato ID: ${contrato.id}`);
      
      const cuotas: Cuota[] = [];
      const fechaInicio = new Date(contrato.fecha_inicio);
      const fechaFin = new Date(contrato.fecha_fin);
      
      // Calcular número total de meses del contrato
      const totalMeses = this.calcularTotalMeses(fechaInicio, fechaFin);
      
      this.logger.log(`Duración del contrato: ${totalMeses} meses, Monto mensual: ${contrato.monto_mensual}`);

      // Generar una cuota por cada mes
      for (let i = 0; i < totalMeses; i++) {
        const cuota = new Cuota();
        cuota.contrato = contrato;
        cuota.contrato_id = contrato.id;
        cuota.numero_referencia = this.generarNumeroReferencia(contrato.id, i + 1);
        cuota.fecha_vencimiento = this.calcularFechaVencimiento(fechaInicio, i);
        
        //Usar directamente el monto_mensual del contrato
        //NO se divide porque ya es el monto por mes
        cuota.monto = contrato.monto_mensual;
        
        cuota.estado = "pendiente";

        cuotas.push(cuota);
        
        this.logger.debug(`Cuota ${i + 1}: ${cuota.numero_referencia}, Monto: ${cuota.monto}, Vence: ${cuota.fecha_vencimiento}`);
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
    
    // Cálculo preciso de meses completos
    let meses = (fin.getFullYear() - inicio.getFullYear()) * 12;
    meses -= inicio.getMonth();
    meses += fin.getMonth();
    
    // Ajustar por días si es necesario
    if (fin.getDate() < inicio.getDate()) {
      meses--; // Restar un mes si no se completa el mes
    }
    
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

  //CAMBIOS PARA EXPENSAS
  async registrarExpensa(createExpensaDto: CreateExpensaDto): Promise<Cuota> {
    const cuotaRepository = AppDataSource.getRepository(Cuota);

    // 🌟🌟🌟 CORRECCIÓN CRÍTICA AQUÍ: Convertir el valor a Date 🌟🌟🌟
    // Esto asegura que, incluso si el @Type() no funciona, TypeORM reciba un objeto Date válido.
    const fechaVencimientoObj = new Date(createExpensaDto.fechaVencimiento);

    const nuevaExpensa = cuotaRepository.create({
        contrato_id: createExpensaDto.contratoId,
        
        // 🚨 Usamos el objeto Date convertido:
        fecha_vencimiento: fechaVencimientoObj, 
        
        monto: createExpensaDto.monto,
        tipo: 'EXPENSA',
        estado: 'pendiente',
        
        // También usamos el objeto Date convertido para la referencia:
        numero_referencia: this.generarReferenciaExpensa(createExpensaDto.contratoId, fechaVencimientoObj), 
    });
    
    // 4. Guardar en la BD
    return cuotaRepository.save(nuevaExpensa);
  }

  //////// funcion para consultarExpensasPorContrato 
  async consultarExpensasPorContrato(contratoId: number): Promise<Cuota[]> {
    // 1. Consultar y filtrar por tipo = 'EXPENSA'
    return AppDataSource.getRepository(Cuota).find({
      where: {
        contrato_id: contratoId,
        tipo: 'EXPENSA', // <-- Filtro por tipo
      },
      order: { fecha_vencimiento: 'DESC' },
      // Aquí puedes añadir relaciones si necesitas mostrar datos del Contrato, etc.
      // relations: ['contrato']
    });
  }
  ///////
  private generarReferenciaExpensa(contratoId: number, fechaVencimiento: Date): string {
  const fecha = new Date(fechaVencimiento);
  const year = fecha.getFullYear();
  // El mes es base 0, por eso se suma 1. PadStart asegura dos dígitos.
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
  
  // Usamos 'E' para Expensa y el año/mes de vencimiento para identificarla.
  return `E${contratoId.toString().padStart(6, '0')}-${year}${month}`; 
}

}