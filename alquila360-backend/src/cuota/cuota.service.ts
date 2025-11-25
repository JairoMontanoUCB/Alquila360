import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Cuota } from "src/entity/cuota.entity";
import { Contrato } from "src/entity/contrato.entity";
import { CreateExpensaDto } from "./cuotaDto/create-expensa.dto";
import { CuotaRules } from "src/common/Rules/CuotaRules";
import { BusinessException } from "src/common/Exceptions/BussinessException";

@Injectable()
export class CuotaService {
  private readonly logger = new Logger(CuotaService.name);

  /**
   * Genera todas las cuotas mensuales para un contrato
   */
  async generarCuotasMensuales(contrato: Contrato): Promise<Cuota[]> {
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
     
      // Usar directamente el monto_mensual del contrato
      cuota.monto = contrato.monto_mensual;
      cuota.estado = "pendiente";

      cuotas.push(cuota);
     
      this.logger.debug(`Cuota ${i + 1}: ${cuota.numero_referencia}, Monto: ${cuota.monto}, Vence: ${cuota.fecha_vencimiento}`);
    }

    // Guardar todas las cuotas en la base de datos
    const cuotasGuardadas = await AppDataSource.getRepository(Cuota).save(cuotas);
   
    this.logger.log(`Se generaron ${cuotasGuardadas.length} cuotas para contrato ID: ${contrato.id}`);
   
    return cuotasGuardadas;
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
   */
  private generarNumeroReferencia(contratoId: number, mes: number): string {
    return `C${contratoId.toString().padStart(6, '0')}-M${mes.toString().padStart(2, '0')}`;
  }

  /**
   * Calcula la fecha de vencimiento para una cuota específica
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
    // Validar que el contrato exista
    await CuotaRules.validarContrato(contratoId);

    return await AppDataSource.getRepository(Cuota).find({
      where: { contrato_id: contratoId },
      order: { fecha_vencimiento: 'ASC' }
    });
  }

  /**
   * Actualiza el estado de una cuota
   */
  async actualizarEstadoCuota(cuotaId: number, estado: string, fechaPago?: Date): Promise<Cuota> {
    // Validar que la cuota exista
    const cuota = await CuotaRules.validarCuotaExistente(cuotaId);

    // Validar transición de estado
    this.validarTransicionEstado(cuota.estado, estado);

    cuota.estado = estado;
    if (fechaPago && estado === 'pagada') {
      cuota.fecha_pago = fechaPago;
    } else if (estado === 'pendiente') {
      cuota.fecha_pago = null;
    }

    return await AppDataSource.getRepository(Cuota).save(cuota);
  }

  /**
   * Valida la transición entre estados
   */
  private validarTransicionEstado(estadoActual: string, estadoNuevo: string): void {
    const transicionesValidas = {
      'pendiente': ['pagada', 'vencida'],
      'vencida': ['pagada'],
      'pagada': [] // Una vez pagada, no puede cambiar
    };

    if (!transicionesValidas[estadoActual]?.includes(estadoNuevo)) {
      throw new BusinessException(
        `Transición de estado no válida: de ${estadoActual} a ${estadoNuevo}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Verifica y actualiza cuotas vencidas automáticamente
   */
  async actualizarCuotasVencidas(): Promise<number> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

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

  /**
   * Registra una nueva expensa
   */
  async registrarExpensa(createExpensaDto: CreateExpensaDto): Promise<Cuota> {
    try {
      // Validar que el contrato exista
      await CuotaRules.validarContrato(createExpensaDto.contratoId);
      
      // Validar monto
      CuotaRules.validarMonto(createExpensaDto.monto);
      
      // Validar fecha de vencimiento
      CuotaRules.validarFechaVencimiento(new Date(createExpensaDto.fechaVencimiento));

      // Generar y validar número de referencia único
      const numeroReferencia = this.generarReferenciaExpensa(createExpensaDto.contratoId, createExpensaDto.fechaVencimiento);
      await CuotaRules.validarNumeroReferenciaUnico(numeroReferencia);

      // Crear nueva expensa
      const cuotaRepository = AppDataSource.getRepository(Cuota);
      const nuevaExpensa = cuotaRepository.create({
        contrato_id: createExpensaDto.contratoId,
        fecha_vencimiento: createExpensaDto.fechaVencimiento,
        monto: createExpensaDto.monto,
        tipo: 'EXPENSA',
        estado: 'pendiente',
        numero_referencia: numeroReferencia,
      });
     
      return await cuotaRepository.save(nuevaExpensa);
    } catch (error) {
      // Si ya es una BusinessException, la relanzamos
      if (error instanceof BusinessException) {
        throw error;
      }
      // Para cualquier otro error, lanzamos una BusinessException genérica
      throw new BusinessException(
        `Error al registrar la expensa: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Consulta expensas por contrato
   */
  async consultarExpensasPorContrato(contratoId: number): Promise<Cuota[]> {
    // Validar que el contrato exista
    await CuotaRules.validarContrato(contratoId);

    return AppDataSource.getRepository(Cuota).find({
      where: {
        contrato_id: contratoId,
        tipo: 'EXPENSA',
      },
      order: { fecha_vencimiento: 'DESC' },
    });
  }

  /**
   * Genera referencia para expensa
   */
  private generarReferenciaExpensa(contratoId: number, fechaVencimiento: Date): string {
    const fecha = new Date(fechaVencimiento);
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
   
    return `E${contratoId.toString().padStart(6, '0')}-${year}${month}`;
  }
}