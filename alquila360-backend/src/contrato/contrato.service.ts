import { Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Contrato } from "src/entity/contrato.entity";
import { User } from "src/entity/user.entity";
import { Propiedad } from "src/entity/propiedad.entity";
import { CreateContratoDto } from "src/contrato/contratoDto/create-contrato.dto";
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { PdfKitGeneratorService } from "src/utils/pdf-generator.service";

@Injectable()
export class ContratoService {
    constructor(private readonly pdfService: PdfKitGeneratorService) {}

    // ======================================================
    // LISTAR CONTRATOS
    // ======================================================
    async getAllContrato() {
        return await AppDataSource.getRepository(Contrato).find({
            relations: ["inquilino", "propiedad"]
        });
    }

    // ======================================================
    // OBTENER POR ID
    // ======================================================
    async getContratoById(id: number) {
        return await AppDataSource.getRepository(Contrato).findOne({
            where: { id },
            relations: ["inquilino", "propiedad"]
        });
    }

    // ======================================================
    // ACTUALIZAR CONTRATO
    // ======================================================
    async updateContrato(id: number, data: any) {

        if (data.fecha_inicio) data.fecha_inicio = new Date(data.fecha_inicio);
        if (data.fecha_fin) data.fecha_fin = new Date(data.fecha_fin);

        await AppDataSource.getRepository(Contrato).update(id, data);
        return this.getContratoById(id);
    }

    // ======================================================
    // ELIMINAR CONTRATO
    // ======================================================
    async deleteContrato(id: number) {
        return await AppDataSource.getRepository(Contrato).delete(id);
    }

    // ======================================================
    // REGISTRAR CONTRATO (validación + cálculos + PDF)
    // ======================================================
    async RegistrarUsuarioContrato(dto: CreateContratoDto) {

        // 1️⃣ Convertir a instancia real del DTO
        const dtoInstance = plainToInstance(CreateContratoDto, dto);

        // 2️⃣ Validar DTO
        const errors = await validate(dtoInstance);
        if (errors.length > 0) {
            const messages = errors
                .map(e => Object.values(e.constraints ?? {}))
                .flat();
            throw new Error("Datos inválidos: " + messages.join(', '));
        }

        // 3️⃣ Desestructurar valores ya transformados
        const { propiedadId, inquilinoId, monto_mensual } = dtoInstance;

        const fecha_inicio = new Date(dtoInstance.fecha_inicio);
        const fecha_fin = new Date(dtoInstance.fecha_fin);

        // 4️⃣ Validar fechas
        if (fecha_fin <= fecha_inicio)
            throw new Error("La fecha de finalización debe ser mayor a la fecha de inicio.");
/*
        if (fecha_inicio < new Date())
            throw new Error("La fecha de inicio no puede ser en el pasado.");
*/
        // 5️⃣ Buscar inquilino
        const usuario = await AppDataSource.getRepository(User).findOneBy({ id: inquilinoId });
        if (!usuario) throw new Error("Usuario no encontrado.");
        if (usuario.rol != "inquilino") throw new Error("El usuario no es un inquilino.");
        if (usuario.estado != "activo") throw new Error("El usuario no está activo.");

        // 6️⃣ Buscar propiedad
const propiedad = await AppDataSource.getRepository(Propiedad).findOne({
    where: { id: propiedadId },
    relations: ['propietario']
});
        if (!propiedad) throw new Error("Propiedad no encontrada.");
        if (propiedad.estado != "disponible") throw new Error("La propiedad no está disponible.");

        // 7️⃣ Calcular duración del contrato
        const mesesDuracion = this.CalcularMesesContrato(fecha_inicio, fecha_fin);

        // 8️⃣ Calcular garantía
        const garantia = this.CalcularGarantia(monto_mensual, propiedad.tipo, mesesDuracion);

        // 9️⃣ Crear entidad Contrato
        const contrato = new Contrato();
        contrato.inquilino = usuario;
        contrato.propiedad = propiedad;
        contrato.fecha_inicio = fecha_inicio;
        contrato.fecha_fin = fecha_fin;
        contrato.monto_mensual = monto_mensual;
        contrato.garantia = garantia;

        // Guardar contrato por primera vez
        await AppDataSource.getRepository(Contrato).save(contrato);

        // 🔟 Generar PDF
        const pdfPath = await this.pdfService.generateContractPDF({
            Id: contrato.id,
            Inquilino: usuario,
            Propiedad: propiedad,
            fecha_inicio,
            fecha_fin,
            monto_mensual,
            garantia
        });

        contrato.archivo_pdf = pdfPath;

        // Guardar contrato con PDF
        await AppDataSource.getRepository(Contrato).save(contrato);

        return {
            mensaje: "Contrato creado correctamente",
            contrato
        };
    }

    // ======================================================
    // CALCULAR MESES ENTRE FECHAS
    // ======================================================
    CalcularMesesContrato(inicio: Date, fin: Date): number {
        const diff = fin.getTime() - inicio.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24 * 30.44));
    }

    // ======================================================
    // CALCULAR GARANTÍA SEGÚN TIPO DE PROPIEDAD + DURACIÓN
    // ======================================================
    CalcularGarantia(monto: number, tipo: string, meses: number): number {
        
        let porcentaje = {
            departamento: 1,
            casa: 1.5,
            local: 2,
            oficina: 1.5
        }[tipo] ?? 1;

        let factor =
            meses < 6 ? 1.2 :
            meses <= 12 ? 1 :
            meses <= 24 ? 0.7 :
            0.5;

        return monto * porcentaje * factor;
    }
}
