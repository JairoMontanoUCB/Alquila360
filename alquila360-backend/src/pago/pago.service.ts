import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Pago } from "src/entity/pago.entity";

import { Contrato } from "src/entity/contrato.entity";
import { Propiedad } from "src/entity/propiedad.entity";
import { PdfKitGeneratorService } from "src/utils/pdf-generator.service";
import { EmailService } from "src/email/email.service";
 

@Injectable()
export class PagoService {
    constructor(private readonly pdfService: PdfKitGeneratorService, private readonly emailService: EmailService) {}

    async createPago(pago:Pago)
    {
        // 1. Guardar en BD
        const pagoCreado = await AppDataSource.getRepository(Pago).save(pago);

        // 2. Obtener contrato y propiedad
        const contrato = await AppDataSource.getRepository(Contrato).findOne({
            where: { id: pago.id_contrato },
        });
        if (!contrato) {
            throw new HttpException(`Contrato con id ${pago.id_contrato} no existe`, HttpStatus.BAD_REQUEST);
        }

        const propiedad = await AppDataSource.getRepository(Propiedad).findOne({
            where: { id: contrato.id_propiedad },
        });
        if (!propiedad) {
            throw new Error(`Propiedad asociada al contrato ${contrato.id} no existe`);
        }
        

        // 3. Crear PDF
        const pdfPath = await this.pdfService.generatePaymentPDF({
            id: pagoCreado.id,
            fecha: pagoCreado.fecha_pago,
            monto: pagoCreado.monto,
            propiedad,
            contrato,
        }); 

        pagoCreado.ruta_pdf = pdfPath;
        await AppDataSource.getRepository(Pago).save(pagoCreado);

        await this.emailService.sendPaymentEmail(
            pagoCreado.inquilino?.email ?? 'correo@dummy.com', 
            pagoCreado.monto,
            pagoCreado.fecha_pago.toISOString().slice(0, 10)
        );

        return pagoCreado;
    }

    async getAllPago()
    {
        return await AppDataSource.getRepository(Pago).find();
    }
    async getPagoById(id:number)
    {
        return await AppDataSource.getRepository(Pago).findOneBy({id}); 
    }
    async updatePago(id:number, pagoData : Partial<Pago>)
    {
        return await AppDataSource.getRepository(Pago).update(id, pagoData);
        return this.getPagoById(id);
    }
    async deletePago(id:number)
    {
        return await AppDataSource.getRepository(Pago).delete(id);
    }
}