import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Pago } from "src/entity/pago.entity";
import { CreatePagoDto } from "./pagoDto/create-pago.dto";
import { PagoRules } from "src/common/Rules/PagoRules";

import { Contrato } from "src/entity/contrato.entity";
import { Propiedad } from "src/entity/propiedad.entity";
import { PdfKitGeneratorService } from "src/utils/pdf-generator.service";

 

@Injectable()
export class PagoService {
    constructor(private readonly pdfService: PdfKitGeneratorService) {}
    

    async createPago(createPagoDto: CreatePagoDto) {
        // Validaciones con PagoRules
        const contrato = await PagoRules.validarContrato(createPagoDto.id_contrato);
        const propiedad = await PagoRules.validarPropiedadDelContrato(contrato);
        PagoRules.validarMonto(createPagoDto.monto);
        PagoRules.validarFechaPago(new Date(createPagoDto.fecha_pago));
        PagoRules.validarMedioPago(createPagoDto.medio_pago);
        
        if (createPagoDto.recibo_numero) {
            PagoRules.validarReciboNumero(createPagoDto.recibo_numero);
        }

        // 1. Crear instancia de Pago a partir del DTO
        const pago = new Pago();
        pago.id_contrato = createPagoDto.id_contrato;
        pago.fecha_pago = new Date(createPagoDto.fecha_pago);
        pago.monto = createPagoDto.monto;
        pago.medio_pago = createPagoDto.medio_pago;
        pago.recibo_numero = createPagoDto.recibo_numero;

        // 2. Guardar en BD
        const pagoCreado = await AppDataSource.getRepository(Pago).save(pago);
        
        // 3. Crear PDF (ya tenemos contrato y propiedad validados)
        const pdfPath = await this.pdfService.generatePaymentPDF({
            id: pagoCreado.id,
            fecha: pagoCreado.fecha_pago,
            monto: pagoCreado.monto,
            propiedad,
            contrato,
        });

        pagoCreado.ruta_pdf = pdfPath;
        await AppDataSource.getRepository(Pago).save(pagoCreado);

        return pagoCreado;
    }

    async getAllPago() {
        return await AppDataSource.getRepository(Pago).find({
            relations: ['contrato', 'inquilino']
        });
    }
    
    async getPagoById(id: number) {
        const pago = await AppDataSource.getRepository(Pago).findOne({
            where: { id },
            relations: ['contrato', 'inquilino']
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
        await PagoRules.validarPagoExistente(id);
        return await AppDataSource.getRepository(Pago).delete(id);
    }
}