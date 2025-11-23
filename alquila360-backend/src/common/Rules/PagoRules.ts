import AppDataSource from "src/data-source";
import { Contrato } from "src/entity/contrato.entity";
import { Propiedad } from "src/entity/propiedad.entity";
import { Cuota } from "src/entity/cuota.entity";
import { Pago } from "src/entity/pago.entity";
import { BusinessException, CuotaNoEncontradaException } from '../Exceptions/BussinessException';
import { HttpStatus } from '@nestjs/common';

export class PagoRules {
  /**
   * Valida que el contrato exista
   */
  static async validarContrato(contratoId: number): Promise<Contrato> {
    const contrato = await AppDataSource.getRepository(Contrato).findOne({
      where: { id: contratoId },
      relations: ['propiedad']
    });

    if (!contrato) {
      throw new BusinessException(`Contrato con ID ${contratoId} no encontrado`, HttpStatus.BAD_REQUEST);
    }

    return contrato;
  }

  /**
   * Valida que la propiedad del contrato exista
   */
  static async validarPropiedadDelContrato(contrato: Contrato): Promise<Propiedad> {
    if (!contrato.propiedad) {
      throw new BusinessException(`Propiedad del contrato ${contrato.id} no encontrada`, HttpStatus.BAD_REQUEST);
    }

    return contrato.propiedad;
  }

  /**
   * Valida que la cuota exista y esté pendiente
   */
  static async validarCuota(cuotaId: number, montoPago: number): Promise<Cuota> {
    const cuota = await AppDataSource.getRepository(Cuota).findOne({
      where: { id: cuotaId }
    });

    if (!cuota) {
      throw new CuotaNoEncontradaException(cuotaId);
    }

    if (cuota.estado !== 'pendiente') {
      throw new BusinessException(`La cuota ${cuotaId} ya está ${cuota.estado}`, HttpStatus.BAD_REQUEST);
    }

    // Validar que el monto del pago coincida con el monto de la cuota
    if (Math.abs(cuota.monto - montoPago) > 0.01) { // Tolerancia para decimales
      throw new BusinessException(
        `El monto del pago (${montoPago}) no coincide con el monto de la cuota (${cuota.monto})`, 
        HttpStatus.BAD_REQUEST
      );
    }

    return cuota;
  }

  /**
   * Valida el monto del pago
   */
  static validarMonto(monto: number): void {
    if (monto <= 0) {
      throw new BusinessException("El monto debe ser mayor a 0", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Valida la fecha de pago
   */
  static validarFechaPago(fechaPago: Date): void {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaPago > hoy) {
      throw new BusinessException("La fecha de pago no puede ser futura", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Valida el medio de pago
   */
  static validarMedioPago(medioPago: string): void {
    const mediosValidos = ["efectivo", "transferencia", "qr", "otro"];
    if (!mediosValidos.includes(medioPago)) {
      throw new BusinessException(`Medio de pago '${medioPago}' no válido`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Valida el número de recibo
   */
  static validarReciboNumero(reciboNumero: string): void {
    if (reciboNumero.length < 3) {
      throw new BusinessException("El número de recibo debe tener al menos 3 caracteres", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Valida que el pago exista
   */
  static async validarPagoExistente(pagoId: number): Promise<Pago> {
    const pago = await AppDataSource.getRepository(Pago).findOne({
      where: { id: pagoId }
    });

    if (!pago) {
      throw new BusinessException(`Pago con ID ${pagoId} no encontrado`, HttpStatus.NOT_FOUND);
    }

    return pago;
  }
}