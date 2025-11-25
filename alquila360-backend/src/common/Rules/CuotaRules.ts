// src/common/Rules/CuotaRules.ts
import { HttpStatus } from '@nestjs/common';
import AppDataSource from "src/data-source";
import { Contrato } from "src/entity/contrato.entity";
import { Cuota } from "src/entity/cuota.entity";
import { BusinessException } from '../Exceptions/BussinessException';

export class CuotaRules {
  
   // Valida que el contrato exista
  static async validarContrato(contratoId: number): Promise<Contrato> {
    const contrato = await AppDataSource.getRepository(Contrato).findOne({
      where: { id: contratoId }
    });

    if (!contrato) {
      throw new BusinessException(`Contrato con ID ${contratoId} no encontrado`, HttpStatus.BAD_REQUEST);
    }

    return contrato;
  }

   //Valida que la cuota exista
  static async validarCuotaExistente(cuotaId: number): Promise<Cuota> {
    const cuota = await AppDataSource.getRepository(Cuota).findOne({
      where: { id: cuotaId }
    });

    if (!cuota) {
      throw new BusinessException(`Cuota con ID ${cuotaId} no encontrada`, HttpStatus.BAD_REQUEST);
    }

    return cuota;
  }


   // Valida que la cuota esté pendiente
  static validarCuotaPendiente(cuota: Cuota): void {
    if (cuota.estado !== 'pendiente') {
      throw new BusinessException(`La cuota ${cuota.id} ya está ${cuota.estado}`, HttpStatus.BAD_REQUEST);
    }
  }

   // Valida que el monto sea positivo
  static validarMonto(monto: number): void {
    if (monto <= 0) {
      throw new BusinessException("El monto debe ser mayor a 0", HttpStatus.BAD_REQUEST);
    }
  }

   // Valida la fecha de vencimiento
  static validarFechaVencimiento(fechaVencimiento: Date): void {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaVencimiento < hoy) {
      throw new BusinessException("La fecha de vencimiento no puede ser anterior a hoy", HttpStatus.BAD_REQUEST);
    }
  }

   // Valida que el número de referencia sea único
  static async validarNumeroReferenciaUnico(numeroReferencia: string): Promise<void> {
    const cuotaExistente = await AppDataSource.getRepository(Cuota).findOne({
      where: { numero_referencia: numeroReferencia }
    });

    if (cuotaExistente) {
      throw new BusinessException(`El número de referencia ${numeroReferencia} ya existe`, HttpStatus.BAD_REQUEST);
    }
  }
}