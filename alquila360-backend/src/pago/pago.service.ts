import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Pago } from "src/entity/pago.entity";
import { CreatePagoDto } from "./pagoDto/create-pago.dto";
import { PagoRules } from "src/common/Rules/PagoRules";
import { Cuota } from "src/entity/cuota.entity";
import { User } from "src/entity/user.entity";
import { BusinessException } from "src/common/Exceptions/BussinessException";
import { PdfKitGeneratorService } from "src/utils/pdf-generator.service";

@Injectable()
export class PagoService {
  constructor(private readonly pdfService: PdfKitGeneratorService) {}

  /**
   * Registra un pago correspondiente a una cuota específica
   */
  async createPago(createPagoDto: CreatePagoDto, inquilinoId?: number) {
    try {
      // Validaciones con PagoRules
      const contrato = await PagoRules.validarContrato(createPagoDto.id_contrato);
      const propiedad = await PagoRules.validarPropiedadDelContrato(contrato);
      
      // Validar la cuota
      const cuota = await PagoRules.validarCuota(createPagoDto.cuota_id, createPagoDto.monto);
      
      PagoRules.validarFechaPago(new Date(createPagoDto.fecha_pago));
      PagoRules.validarMedioPago(createPagoDto.medio_pago);

      if (createPagoDto.recibo_numero) {
        PagoRules.validarReciboNumero(createPagoDto.recibo_numero);
      }

      // Crear instancia de Pago
      const pago = new Pago();
      pago.id_contrato = createPagoDto.id_contrato;
      pago.cuota_id = createPagoDto.cuota_id;
      pago.fecha_pago = new Date(createPagoDto.fecha_pago);
      pago.monto = createPagoDto.monto;
      pago.medio_pago = createPagoDto.medio_pago;
      pago.recibo_numero = createPagoDto.recibo_numero;

      // Asignar inquilino si se proporciona
      if (inquilinoId) {
        const inquilino = await AppDataSource.getRepository(User).findOneBy({ id: inquilinoId });
        if (inquilino) {
          pago.inquilino = inquilino;
        }
      }

      // Guardar el pago en BD
      const pagoCreado = await AppDataSource.getRepository(Pago).save(pago);

      // Actualizar el estado de la cuota a "pagada"
      await this.actualizarEstadoCuota(createPagoDto.cuota_id, 'pagada', new Date(createPagoDto.fecha_pago));

      // Generar PDF con información de la cuota
      const pdfPath = await this.pdfService.generatePaymentPDF({
        id: pagoCreado.id,
        fecha: pagoCreado.fecha_pago,
        monto: pagoCreado.monto,
        propiedad,
        contrato,
        cuota
      });

      // Actualizar el pago con la ruta del PDF
      pagoCreado.ruta_pdf = pdfPath;
      await AppDataSource.getRepository(Pago).save(pagoCreado);

      return pagoCreado;
    } catch (error) {
      // Si ya es una BusinessException, la relanzamos
      if (error instanceof BusinessException) {
        throw error;
      }
      // Para cualquier otro error, lanzamos una BusinessException genérica
      throw new BusinessException(
        `Error al registrar el pago: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Actualiza el estado de una cuota y la fecha de pago (puede ser null)
   */
  private async actualizarEstadoCuota(cuotaId: number, estado: string, fechaPago: Date | null): Promise<void> {
    const cuotaRepository = AppDataSource.getRepository(Cuota);
    const cuota = await cuotaRepository.findOneBy({ id: cuotaId });
    
    if (!cuota) {
      throw new BusinessException(`Cuota con ID ${cuotaId} no encontrada`, HttpStatus.BAD_REQUEST);
    }

    cuota.estado = estado;
    if (fechaPago && estado === 'pagada') {
      cuota.fecha_pago = fechaPago;
    } else if (estado === 'pendiente') {
      cuota.fecha_pago = null;
    }

    await cuotaRepository.save(cuota);
  }

  async getAllPago() {
    return await AppDataSource.getRepository(Pago).find({
      relations: ['contrato', 'inquilino', 'cuota']
    });
  }

  async getPagoById(id: number) {
    const pago = await AppDataSource.getRepository(Pago).findOne({
      where: { id },
      relations: ['contrato', 'inquilino', 'cuota']
    });

    await PagoRules.validarPagoExistente(id);
    return pago;
  }

  async updatePago(id: number, pagoData: Partial<Pago>) {
    await PagoRules.validarPagoExistente(id);

    if (pagoData.monto !== undefined) {
      PagoRules.validarMonto(pagoData.monto);
    }

    if (pagoData.fecha_pago !== undefined) {
      PagoRules.validarFechaPago(new Date(pagoData.fecha_pago));
    }

    if (pagoData.medio_pago !== undefined) {
      PagoRules.validarMedioPago(pagoData.medio_pago);
    }

    if (pagoData.recibo_numero !== undefined) {
      PagoRules.validarReciboNumero(pagoData.recibo_numero);
    }

    await AppDataSource.getRepository(Pago).update(id, pagoData);
    return this.getPagoById(id);
  }

  async deletePago(id: number) {
    const pago = await PagoRules.validarPagoExistente(id);
    
    // Revertir el estado de la cuota a "pendiente" y quitar la fecha de pago
    if (pago.cuota_id) {
      await this.actualizarEstadoCuota(pago.cuota_id, 'pendiente', null);
    }

    return await AppDataSource.getRepository(Pago).delete(id);
  }
}